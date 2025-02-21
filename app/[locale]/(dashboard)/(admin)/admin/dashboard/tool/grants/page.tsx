"use client";

import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import SpinnerLoading from "@/components/Spinner/page";

interface GrantApplication {
  id: number;
  application: string;
  user_id: string | null;
}

type Admin = {
  admin: boolean;
};

async function getData() {
  const res = await fetch(`/api/user/isAdmin`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default function GrantsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<GrantApplication | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [grantDuration, setGrantDuration] = useState<number | string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setAdmin(data);
        
        if (data?.admin === false) {
          router.push('/dashboard/catalog');
        } else {
          try {
            const res = await fetch("/api/grant/find");
            const data = await res.json();
            setApplications(data);
          } catch (error) {
            console.error("Error fetching applications:", error);
          } finally {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [router]);

  const openModal = (application: GrantApplication) => {
    setSelectedApplication(application);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedApplication(null);
    setGrantDuration(""); // Сбросить значение ввода
  };

  const handleApprove = async () => {
    if (selectedApplication?.user_id && admin?.admin) {
      try {
        const userId = selectedApplication.user_id ? parseInt(selectedApplication.user_id, 10) : null;
        const grantId = selectedApplication.id;
        const grantDurationNumber = Number(grantDuration);
  
        if (userId === null || isNaN(userId)) {
          console.error("Ошибка: Неверный формат ID пользователя");
          return;
        }
  
        if (isNaN(grantDurationNumber)) {
          console.error("Ошибка: Неверное количество месяцев");
          return;
        }
  
        // 1️⃣ Обновляем баланс и создаем запись в Payment
        const responseBalancePayment = await fetch(`/api/user/updateBalanceAndPayment`, {
          method: "POST",
          body: JSON.stringify({
            user_id: userId,
            grant_duration: grantDurationNumber,
          }),
          headers: { "Content-Type": "application/json" },
        });
  
        if (!responseBalancePayment.ok) {
          console.error('Ошибка при обновлении баланса и записи платежа', await responseBalancePayment.text());
          return;
        }
  
        // 2️⃣ Одобряем заявку
        const responseApprove = await fetch(`/api/grant/approve`, {
          method: "POST",
          body: JSON.stringify({
            user_id: userId,
            id: grantId,
            grant_duration: grantDurationNumber,
          }),
          headers: { "Content-Type": "application/json" },
        });
  
        if (!responseApprove.ok) {
          console.error('Ошибка при одобрении заявки', await responseApprove.text());
          return;
        }
  
        console.log(await responseApprove.json());
  
        // Закрытие модального окна
        closeModal();
  
        // Удаление заявки из списка
        setApplications((prevApplications) =>
          prevApplications.filter((app) => app.id !== selectedApplication.id)
        );
      } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
      }
    } else {
      alert("У вас нет прав для выполнения этого действия.");
    }
  };
  
  
  

  const handleReject = async () => {
    if (selectedApplication?.user_id && admin?.admin) {
      try {
        const userId = selectedApplication.user_id ? parseInt(selectedApplication.user_id, 10) : null;

        if (userId === null || isNaN(userId)) {
          console.error("Ошибка: Неверный формат ID пользователя");
          return;
        }

        // Запрос на отклонение заявки
        const responseReject = await fetch(`/api/grant/reject`, {
          method: "POST",
          body: JSON.stringify({
            user_id: userId,
            grant_review: false,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!responseReject.ok) {
          console.error('Ошибка при отклонении заявки', await responseReject.text());
          return;
        }

        // Запрос на удаление заявки
        const responseDelete = await fetch(`/api/grant/delete`, {
          method: "DELETE",
          body: JSON.stringify({ id: selectedApplication.id }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!responseDelete.ok) {
          console.error('Ошибка при удалении заявки', await responseDelete.text());
          return;
        }

        // Закрытие модального окна
        closeModal();

        // Удаление заявки из списка
        setApplications((prevApplications) =>
          prevApplications.filter((app) => app.id !== selectedApplication.id)
        );
      } catch (error) {
        console.error("Ошибка при отклонении заявки:", error);
      }
    } else {
      alert("У вас нет прав для выполнения этого действия.");
    }
  };

  return (
    <div className="p-4">
      <head>
        <title>Заявки на грант</title>
      </head>
      <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">Заявки на грант</span>
      <div className="mt-10 flex justify-center">{loading && <SpinnerLoading />}</div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mt-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="flex flex-col border rounded-2xl p-4 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
          >
            <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">
              Заявка № {app.id}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Пользователь: {app.user_id ?? "Не указан"}</span>
            <button
              onClick={() => openModal(app)}
              className="mt-2 text-center text-sm bg-indigo-600 hover:bg-indigo-500 text-white py-1 rounded-md"
            >
              Ознакомиться
            </button>
          </div>
        ))}
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="max-w-3xl bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl">
                <Dialog.Title className="text-2xl font-medium text-center text-zinc-800 dark:text-slate-200">
                  Детали заявки
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-zinc-400">ID пользователя: {selectedApplication?.user_id ?? "Не указан"}</p>
                  <p className="mt-2 text-zinc-800 dark:text-slate-200">{selectedApplication?.application}</p>
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-600 dark:text-zinc-400">Количество месяцев гранта</label>
                  <input
                    type="number"
                    value={grantDuration}
                    onChange={(e) => setGrantDuration(e.target.value)}
                    className="mt-1 p-2 border rounded-md w-full"
                    placeholder="Введите количество месяцев"
                  />

                </div>
                <div className="mt-4 flex justify-end gap-4">
                  <button
                    onClick={handleReject}
                    className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-md"
                  >
                    Отклонить
                  </button>
                  <button
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md"
                  >
                    Одобрить
                  </button>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md"
                  >
                    Закрыть
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
