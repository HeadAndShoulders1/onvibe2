"use client";

import { useTranslations } from "next-intl";
import SpinnerLoading from "../../Spinner/page";

interface Props {
  grant?: boolean;
  grant_duration?: number;
  loading?: boolean;
  grant_review?: boolean;
}

const getMonthDeclension = (monthCount: number, t: (key: string) => string) => {
  const lastDigit = monthCount % 10;
  const lastTwoDigits = monthCount % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return t("month1"); // 1 месяц
  } else if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
    return t("month2"); // 2, 3, 4 месяца
  } else {
    return t("month3"); // 5+ месяцев
  }
};


export const GrantMenu: React.FC<Props> = ({ grant, loading, grant_duration, grant_review }) => {
  const t = useTranslations("profile");

  if (loading) {
    return (
      <div className="flex justify-center">
        <SpinnerLoading />
      </div>
    );
  }

  if (!grant && !grant_review) {
    return <div className="mt-2 text-gray-300">{t('not_grant')}</div>;
  }
  if (!grant && grant_review) {
    return <div className="mt-2 text-gray-300">{t('applied_grant')}</div>;
  }

  const monthsLabel = grant_duration ? getMonthDeclension(grant_duration, t) : "";
  
  return (
    <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:items-center mt-5">
      <div className="flex flex-col gap-y-1">
        <div className="text-lg font-bold text-slate-200">
          {t('status')}
        </div>
        <div className="text-sm  text-gray-300">
          {t('grant_desc')}
        </div>
      </div>
      <div className="text-lg font-semibold text-slate-200">
        {t('active')}
      </div>
      <div className="flex flex-col gap-y-1">
        <div className="text-lg font-bold text-slate-200">
          {t('expiration')}
        </div>
        <div className="text-sm  text-gray-300">
          {t('expiration_desc')}
        </div>
      </div>
      <div className="text-lg  font-semibold text-slate-200">
        {grant_duration} {monthsLabel}
      </div>
    </div>
  );
}
