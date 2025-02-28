"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import AlertAll from "@/components/Alert/page";
import SpinnerLoading from "@/components/Spinner/page";

type WithdrawalRequest = {
  id: number;
  card_number: string;
  amount: number;
  user_id: number;
  status: string;
};

type Admin = {
  admin: boolean;
};

type AlertState = { type: "success" | "error"; message: string } | null;

async function getData() {
  const res = await fetch(`/api/user/isAdmin`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default function WithdrawalRequests() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [alert, setAlert] = useState<AlertState>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);

  const router = useRouter();

  useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getData();
          setAdmin(data);
          
          if (data?.admin === false) {
            router.push('/dashboard/catalog');
          } else {
              try {
                const res = await fetch("/api/finance/withdrawal/find");
                const data: WithdrawalRequest[] = await res.json();
                setRequests(data);
              } catch (error) {
                console.error("Ошибка загрузки заявок:", error);
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




  const handleApprove = async () => {
    if (!selectedRequest) return;
    try {
      const res = await fetch("/api/finance/withdrawal/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedRequest.id }),
      });
  
      if (!res.ok) throw new Error("Ошибка при одобрении заявки");
  
      setAlert({ type: "success", message: "Заявка одобрена!" });
      closeModal();
    } catch (error) {
      setAlert({ type: "error", message: (error as Error).message });
    }
  };

  const openModal = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedRequest(null);
  };


  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-700 dark:text-slate-200">Заявки на вывод</h1>
      {alert && <AlertAll type={alert.type} message={alert.message} setIsOpen={() => setAlert(null)} />}
      {loading && <SpinnerLoading />}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mt-4">
        {requests.map((req) => (
          <div key={req.id} className="p-4 border rounded-2xl bg-white dark:bg-zinc-900">
            <p>Заявка № {req.id}</p>
            <p>Сумма: {req.amount} ₽</p>
            <p>Статус: {req.status}</p>
            <button onClick={() => openModal(req)} className="mt-2 bg-indigo-600 text-white py-1 px-4 rounded-md">
              Подробнее
            </button>
          </div>
        ))}
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={closeModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl max-w-md">
                <Dialog.Title className="text-2xl font-medium text-center">Детали заявки</Dialog.Title>
                {selectedRequest && (
                  <div className="mt-4">
                    <p>Номер карты: {selectedRequest.card_number}</p>
                    <p>Сумма: {selectedRequest.amount} ₽</p>
                    <p>Статус: {selectedRequest.status}</p>
                  </div>
                )}
                <div className="mt-4 flex justify-end gap-4">
                  <button onClick={handleApprove} className="bg-green-600 text-white py-2 px-4 rounded-md">
                    Одобрить
                  </button>
                  <button onClick={closeModal} className="bg-gray-600 text-white py-2 px-4 rounded-md">
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