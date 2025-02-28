"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function GrantFormPage() {
  const t = useTranslations("profile");
  const [application, setApplication] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/grant/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ application }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка при отправке");
      }

      setMessage("✅ Заявка успешно отправлена!");
      setApplication(""); // Очистка формы
    } catch (error: any) {
      setMessage(`❌ Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className=" mx-auto  p-4">
      <h2 className="text-xl text-zinc-400 dark:text-gray-300">
        {t('apply_grant')}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <textarea
          className="w-full min-h-[200px] bg-white dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 p-3 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('placeholder')}
          value={application}
          onChange={(e) => setApplication(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? t('applying') : t('apply') }
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
