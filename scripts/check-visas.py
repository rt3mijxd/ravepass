"""Compare RavePass's visa snapshot against the publisher's full public matrix."""

import argparse
import csv
from datetime import date
import io
import json
import os
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
STATUS = {
    "visa-free": "visa_free",
    "freedom-of-movement": "visa_free",
    "visa-on-arrival": "visa_on_arrival",
    "eta": "eta",
    "evisa": "evisa",
    "embassy-visa": "visa_required",
    "visa-required": "visa_required",
    "banned": "entry_restricted",
    "travel-permit": "travel_permit",
    "unconfirmed": "unknown",
}
MATRIX_STATUS = {
    "F": "visa_free",
    "A": "visa_on_arrival",
    "E": "evisa",
    "T": "eta",
    "X": "entry_restricted",
    "R": "visa_required",
}


def current_rules():
    matrix_source = (ROOT / "src/data/visa-matrix.ts").read_text()
    snapshot = json.loads(matrix_source.split(" = ", 1)[1].strip().removesuffix(";"))
    rules = {
        (passport, country): (MATRIX_STATUS[code[0]], int(code[1:]) if code[1:] else None)
        for passport, destinations in snapshot.items()
        for country, code in destinations.items()
    }
    overrides = json.loads((ROOT / "src/data/visa-overrides.json").read_text())
    for passport, destinations in overrides.items():
        for country, rule in destinations.items():
            rules[passport, country] = rule["status"], rule["days"]
    return rules


def compare(source_dir):
    manifest = json.loads((source_dir / "index.json").read_text(encoding="utf-8-sig"))
    coverage = manifest["coverage"]
    date.fromisoformat(manifest["dateModified"])
    if manifest["id"] != "travelrequirements-entry-requirements":
        raise ValueError("Unexpected visa data publisher")

    rules = current_rules()
    matrix_text = (source_dir / "visa-matrix.csv").read_text(encoding="utf-8-sig")
    reader = csv.DictReader(io.StringIO(matrix_text))
    expected = {
        "passport_code", "destination_iso2", "requirement", "max_stay_days",
        "source_level", "source_url", "source_last_verified",
    }
    if not expected.issubset(reader.fieldnames or []):
        raise ValueError("Unexpected visa matrix columns")
    pairs = set()
    passports = set()
    destinations = set()
    compared = 0
    unconfirmed = 0
    changes = []
    for row in reader:
        passport, destination = row["passport_code"], row["destination_iso2"]
        pair = passport, destination
        if pair in pairs or not all(re.fullmatch(r"[A-Z]{2}", code) for code in pair):
            raise ValueError(f"Duplicate or invalid pair {pair!r}")
        pairs.add(pair)
        passports.add(passport)
        destinations.add(destination)
        status = STATUS[row["requirement"]]
        if row["source_level"] not in ("row", "policy") or not row["source_url"].startswith(("https://", "http://")):
            raise ValueError(f"Invalid source metadata for {pair!r}")
        days = int(row["max_stay_days"]) if row["max_stay_days"] else None
        if row["source_last_verified"]:
            date.fromisoformat(row["source_last_verified"])
        if passport == destination or pair not in rules:
            continue
        compared += 1
        if status == "unknown":
            unconfirmed += 1
            continue
        previous, previous_days = rules[pair]
        status_differs = status != previous
        stay_differs = days is not None and previous_days is not None and days != previous_days
        if status_differs or stay_differs:
            changes.append({
                "passport": passport, "destination": destination,
                "current_status": previous, "published_status": status,
                "current_days": previous_days, "published_days": days,
                "source_level": row["source_level"], "source_url": row["source_url"],
                "source_last_verified": row["source_last_verified"],
            })

    if (
        len(passports) != coverage["passports"]
        or len(destinations) != coverage["destinations"]
        or len(pairs) != coverage["matrixRows"]
        or len(pairs) != len(passports) * len(destinations)
        or len(passports) < 190
    ):
        raise ValueError("Visa matrix is incomplete or does not match its manifest")

    # Put changes for the main passports and explicitly sourced rows first.
    popular = {"RU", "AM", "GE", "KZ", "BY", "UZ", "KG", "AZ", "UA", "MD", "TJ", "TM"}
    changes.sort(key=lambda row: (
        row["passport"] not in popular, row["source_level"] != "row",
        row["passport"], row["destination"],
    ))
    summary = (
        f"Source snapshot: {manifest['dateModified']}\n"
        f"Source coverage: {len(pairs):,} pairs ({len(passports)} passports, {len(destinations)} destinations)\n"
        f"Compared with RavePass: {compared:,} pairs\n"
        f"Unconfirmed by source among compared pairs: {unconfirmed:,}\n"
        f"Differences to review: {len(changes):,}\n"
    )
    return summary, changes


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, required=True, help="Folder containing the source CSV and manifest")
    parser.add_argument("--report", type=Path, required=True, help="Path for the comparison CSV")
    args = parser.parse_args()
    summary, changes = compare(args.source_dir)
    fields = [
        "passport", "destination", "current_status", "published_status", "current_days",
        "published_days", "source_level", "source_url", "source_last_verified",
    ]
    with args.report.open("w", encoding="utf-8", newline="") as output:
        writer = csv.DictWriter(output, fieldnames=fields)
        writer.writeheader()
        writer.writerows(changes)
    print(summary, end="")
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as output:
            output.write("## Visa rules to review\n\n")
            output.writelines(f"- {line}\n" for line in summary.splitlines())
            output.write("\nDownload the visa review CSV for links and dates. Public visa labels are unchanged by this job.\n")


if __name__ == "__main__":
    main()
