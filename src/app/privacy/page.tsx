"use client";

import { useSettings } from "@/components/SettingsContext";
import { t } from "@/lib/i18n";

const CONTACT_EMAIL = "ravepass@proton.me";

export default function PrivacyPage() {
  const { lang } = useSettings();
  const ru = lang === "ru";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <a href="/" className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 transition-colors">
        {t("nav.back_home", lang)}
      </a>

      <h1 className="text-2xl font-bold">
        {ru ? "Политика конфиденциальности" : "Privacy Policy"}
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {ru ? "Обновлено: июнь 2026" : "Updated: June 2026"}
      </p>

      <div className="space-y-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        {ru ? (
          <>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">1. Общие положения</h2>
              <p>RavePass (далее — «Сервис») — агрегатор концертов за рубежом. Настоящая политика описывает, какие персональные данные мы обрабатываем и как их защищаем, в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">2. Какие данные мы собираем</h2>
              <p>Мы обрабатываем только те данные, которые вы указываете добровольно:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><b>Email</b> — при подписке на уведомления об артистах и (по желанию) в форме обратной связи;</li>
                <li><b>Имя</b> — по желанию, в форме обратной связи;</li>
                <li><b>Текст обращения</b> — то, что вы пишете в обратной связи.</li>
              </ul>
              <p>Мы не собираем платёжные данные и не запрашиваем документы.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">3. Цели обработки</h2>
              <p>Email используется только для отправки уведомлений о новых концертах выбранных вами артистов. Данные обратной связи — для улучшения Сервиса и ответа вам. Мы <b>не продаём и не передаём</b> ваши данные третьим лицам в рекламных целях.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">4. Хранение и защита</h2>
              <p>Данные хранятся в защищённой базе данных (Supabase) с шифрованием при передаче. Письма отправляются через сервис Resend. Доступ к данным ограничен.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">5. Отзыв согласия и удаление</h2>
              <p>Вы можете в любой момент отписаться от уведомлений по ссылке в любом письме или запросить удаление ваших данных, написав на {" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-500 hover:underline">{CONTACT_EMAIL}</a>.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">6. Партнёрские ссылки</h2>
              <p>Ссылки на авиабилеты ведут на сервис Aviasales через партнёрскую программу Travelpayouts. Мы можем получать комиссию с бронирований — на стоимость для вас это не влияет.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">7. Аналитика</h2>
              <p>Мы используем обезличенную веб-аналитику (без cookie), чтобы понимать посещаемость. Персональная идентификация не производится.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">8. Контакты</h2>
              <p>Вопросы по обработке данных: {" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-500 hover:underline">{CONTACT_EMAIL}</a>.</p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">1. Overview</h2>
              <p>RavePass (the “Service”) is a concerts-abroad aggregator. This policy describes what personal data we process and how we protect it.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">2. Data we collect</h2>
              <p>We only process data you voluntarily provide:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><b>Email</b> — when subscribing to artist notifications and (optionally) in the feedback form;</li>
                <li><b>Name</b> — optional, in the feedback form;</li>
                <li><b>Message text</b> — what you write in feedback.</li>
              </ul>
              <p>We do not collect payment data or request documents.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">3. Purpose</h2>
              <p>Email is used solely to notify you about new concerts by artists you follow. We <b>do not sell or share</b> your data with third parties for advertising.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">4. Storage & security</h2>
              <p>Data is stored in a secured database (Supabase) with encryption in transit. Emails are sent via Resend. Access is restricted.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">5. Withdrawal & deletion</h2>
              <p>You can unsubscribe anytime via the link in any email, or request deletion by writing to {" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-500 hover:underline">{CONTACT_EMAIL}</a>.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">6. Affiliate links</h2>
              <p>Flight links point to Aviasales via the Travelpayouts affiliate program. We may earn a commission — at no extra cost to you.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">7. Analytics</h2>
              <p>We use anonymous, cookieless web analytics to understand traffic. No personal identification is performed.</p>
            </section>
            <section className="space-y-2">
              <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">8. Contact</h2>
              <p>Questions about data processing: {" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-500 hover:underline">{CONTACT_EMAIL}</a>.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
