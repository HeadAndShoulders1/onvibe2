import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

export default function LicenseForm() {
  const t = useTranslations('license')
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);


  const [errorPassportSerialNumber, setErrorPassportSerialNumber] = useState('');
  const [errorPassportNumberNumber, setErrorPassportNumberNumber] = useState('');

  const [errorPassportOfficeId, setErrorPassportOfficeId] = useState('');
  const [InputValueLastName, setInputValueLastName] = useState('');

  const last_name_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^[а-яА-Я]*$/.test(value)) {
      setInputValueLastName(value);
    }
  };
  const [InputValueFirstName, setInputValueFirstName] = useState('');
  const first_name_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^[а-яА-Я]*$/.test(value)) {
      setInputValueFirstName(value);
    }
  };
  const [InputValueMiddleName, setInputValueMiddletName] = useState('');
  const middle_name_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^[а-яА-Я]*$/.test(value)) {
      setInputValueMiddletName(value);
    }
  };
  const [InputValueDateBirth, setInputValueDate] = useState('')

  const date_birth_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value
    setInputValueDate(value)
  };

  const [InputValuePlaceBirth, setInputValuePlaceBirth] = useState('');
  const place_birth_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^[а-яА-Я]*$/.test(value)) {
      setInputValuePlaceBirth(value);
    }
  };
  const [InputValueNumberPhone, setInputValueNumberPhone] = useState('');
  const number_phone_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^\d{0,15}$/.test(value)) {
      setInputValueNumberPhone(value);
    }
  };
  const [InputValuePassportSerialNumber, setInputValuePassportSerialNumber] = useState('');
  const passport_serial_number_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setInputValuePassportSerialNumber(value);
      setErrorPassportSerialNumber('');
    }
  };
  const [InputValuePassportNumberNumber, setInputValuePassportNumberNumber] = useState('');
  const passport_number_number_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setInputValuePassportNumberNumber(value);
      setErrorPassportNumberNumber('');
    }
  };
  const [InputValuePassportReceived, setInputValuePassportReceived] = useState('');
  const passport_received_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setInputValuePassportReceived(value);
  };
  const [InputValuePassportRecievedBy, setInputValuePassportRecievedBy] = useState('');
  const passport_recieved_by_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^[а-яА-Я ]*$/.test(value)) {
      setInputValuePassportRecievedBy(value);
    }
  };
  const [InputValuePassportOfficeId, setInputValuePassportOfficeId] = useState('');
  const passport_office_id_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setInputValuePassportOfficeId(value);
      setErrorPassportOfficeId('');
    }
  };
  const [InputValueRegistrationAddres, setInputValueRegistrationAddres] = useState('');
  const registration_addres_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^[а-яА-Я0-9,.-]*$/.test(value)) {
      setInputValueRegistrationAddres(value);
    }
  };
  const [InputValueBankAccountNumber, setInputValueBankAccountNumber] = useState('');
  const bank_account_number_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    if (/^\d{0,16}$/.test(value)) {
      setInputValueBankAccountNumber(value);
    }
  };
  const [InputValueBankName, setInputValueBankName] = useState('');
  const bank_name_change = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setInputValueBankName(value);
  };



  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 300;
      canvas.height = 150;
      const context = canvas.getContext('2d');
      if (context) {
        contextRef.current = context;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 2;
      }
    }
  }, []);

  const startDrawing = (e: { nativeEvent: { offsetX: any; offsetY: any; }; }) => {
    const context = contextRef.current;
    if (context) {
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: { nativeEvent: { offsetX: any; offsetY: any; }; }) => {
    if (!isDrawing) return;
    const context = contextRef.current;
    if (context) {
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
    }
  };

  const endDrawing = () => {
    const context = contextRef.current;
    if (context) {
      context.closePath();
      setIsDrawing(false);
    }
  };


  const router = useRouter()

  const handlerSubmit = async () => {
    const canvas = canvasRef.current;
    var errorall = 0;
    const dataURL = canvas?.toDataURL();


    if (InputValuePassportSerialNumber.length !== 4) {
      errorall = errorall + 1;
      setErrorPassportSerialNumber(t('errorPassportSerialNumber'));
    } else {
      setErrorPassportSerialNumber('');
    }

    if (InputValuePassportNumberNumber.length !== 6) {
      errorall = errorall + 1;
      setErrorPassportNumberNumber(t('errorPassportNumberNumber'));
    } else {
      setErrorPassportNumberNumber('');
    }

    if (InputValuePassportOfficeId.length !== 6) {
      errorall = errorall + 1;
      setErrorPassportOfficeId(t('errorPassportOfficeId'));
    } else {
      setErrorPassportOfficeId('');
    }

    if (errorall == 0) {
      const response = await fetch(`/api/user/moderate_license`, {
        method: 'POST',
        body: JSON.stringify({
          last_name: InputValueLastName,
          first_name: InputValueFirstName,
          middle_name: InputValueMiddleName,
          date_birth: InputValueDateBirth,
          place_of_birth: InputValuePlaceBirth,
          number_phone: InputValueNumberPhone,

          passport_serial_number: parseInt(InputValuePassportSerialNumber, 10),
          passport_number_number: parseInt(InputValuePassportNumberNumber, 10),
          passport_date_received: InputValuePassportReceived,
          passport_recieved_by: InputValuePassportRecievedBy,
          passport_office_id: InputValuePassportOfficeId,
          registration_address: InputValueRegistrationAddres,

          bank_account_number: InputValueBankAccountNumber,
          bank_name: InputValueBankName,

          signature: dataURL,

        }),
      });
      if (response) {
        router.push('/dashboard/profile/');
        router.refresh();
      }
    }
  };
  const argument_passport = [
    {
      id: 1,
      svg: <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" fill="none"><path d="M14 13V12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12V13M10.5 16H13.5C13.9659 16 14.1989 16 14.3827 15.9239C14.6277 15.8224 14.8224 15.6277 14.9239 15.3827C15 15.1989 15 14.9659 15 14.5C15 14.0341 15 13.8011 14.9239 13.6173C14.8224 13.3723 14.6277 13.1776 14.3827 13.0761C14.1989 13 13.9659 13 13.5 13H10.5C10.0341 13 9.80109 13 9.61732 13.0761C9.37229 13.1776 9.17761 13.3723 9.07612 13.6173C9 13.8011 9 14.0341 9 14.5C9 14.9659 9 15.1989 9.07612 15.3827C9.17761 15.6277 9.37229 15.8224 9.61732 15.9239C9.80109 16 10.0341 16 10.5 16ZM12.0627 6.06274L11.9373 5.93726C11.5914 5.59135 11.4184 5.4184 11.2166 5.29472C11.0376 5.18506 10.8425 5.10425 10.6385 5.05526C10.4083 5 10.1637 5 9.67452 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V10.2C21 9.0799 21 8.51984 20.782 8.09202C20.5903 7.71569 20.2843 7.40973 19.908 7.21799C19.4802 7 18.9201 7 17.8 7H14.3255C13.8363 7 13.5917 7 13.3615 6.94474C13.1575 6.89575 12.9624 6.81494 12.7834 6.70528C12.5816 6.5816 12.4086 6.40865 12.0627 6.06274Z" className="stroke-black dark:stroke-gray-200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
      title: t('encryption'),
      descript: t('encryption_descript')
    },
    {
      id: 2,
      svg: <svg xmlns="http://www.w3.org/2000/svg" className="fill-black dark:fill-gray-200" width="3em" height="3em" viewBox="0 0 32 32" id="Layer_1" data-name="Layer 1"><path d="M22,14a8,8,0,1,0,8,8A8.0092,8.0092,0,0,0,22,14Zm5.91,7H25.9563a12.03,12.03,0,0,0-1.2183-4.3325A6.01,6.01,0,0,1,27.91,21Zm-7.8545,0A10.0135,10.0135,0,0,1,22,16.0146,10.0121,10.0121,0,0,1,23.9448,21Zm3.89,2A10.01,10.01,0,0,1,22,27.9854,10.0121,10.0121,0,0,1,20.0552,23Zm-4.6831-6.332A12.0265,12.0265,0,0,0,18.0435,21H16.09A6.01,6.01,0,0,1,19.2617,16.668ZM16.09,23h1.9532a12.0265,12.0265,0,0,0,1.2182,4.332A6.01,6.01,0,0,1,16.09,23Zm8.6482,4.332A12.0242,12.0242,0,0,0,25.9565,23H27.91A6.0088,6.0088,0,0,1,24.7385,27.332Z" transform="translate(0 0)" /><rect x="6" y="14" width="6" height="2" /><rect x="6" y="6" width="12" height="2" /><rect x="6" y="10" width="12" height="2" /><rect x="6" y="24" width="6" height="2" /><path d="M12,30H4a2.0021,2.0021,0,0,1-2-2V4A2.0021,2.0021,0,0,1,4,2H20a2.0021,2.0021,0,0,1,2,2v8H20V4H4V28h8Z" transform="translate(0 0)" /></svg>,
      title: t('politica'),
      descript: t('politica_descript')
    },
    {
      id: 3,
      svg: <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 1024 1024" className="fill-black dark:fill-gray-200" version="1.1"><path d="M908.008473 139.713707L529.299213 3.059374a51.005609 51.005609 0 0 0-17.397182-3.059374c-5.950311 0-11.855934 1.03125-17.534682 3.090312L117.015902 139.744645c-20.394681 7.397498-34.704989 26.774679-34.70499 48.472173v323.781463c0 72.287165 23.299368 144.584643 67.763417 214.87806 34.082802 53.875921 81.520288 106.71028 140.256832 157.045577 98.209345 84.156849 195.655565 132.70121 199.749627 134.725896a51.957797 51.957797 0 0 0 22.96593 5.352186c7.717185 0 15.485933-1.732499 22.608431-5.197498 4.094061-1.993749 101.495594-49.78186 199.797752-133.605272 58.794982-50.132485 105.520905-102.966844 139.627769-157.031827 44.446861-70.444666 66.601542-143.171831 66.601543-216.167122V188.216818c0.003437-21.731868-13.230933-41.133112-33.67374-48.503111zM164.810887 511.757656V226.768368c0-10.848747 6.648123-20.539056 16.847183-24.237805l320.759902-116.692777c2.859999-1.034687 6.142811-1.797812 9.580309-1.797812v427.961745h349.631456c0.020625 0 0.044687 0.464062 0.044688 0.759687-0.06875 93.255909-47.038736 185.679943-139.58652 275.670228-72.273415 70.279666-154.384953 120.436213-196.621503 144.096519-3.915311 2.196562-10.027184 3.231249-13.464683 3.231249V511.867656l-347.190832-0.11z" /></svg>,
      title: t('safety'),
      descript: t('safety_descript')
    },
  ]

  return (
    <form>
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm">
        <div className="grid gap-4 justify-center text-center">
          <div className="flex w-full items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="fill-black dark:fill-gray-200" width="4em" height="4em" viewBox="0 0 32 32" id="icon">
              <path d="M29.707,19.293l-3-3a.9994.9994,0,0,0-1.414,0L16,25.5859V30h4.4141l9.2929-9.293A.9994.9994,0,0,0,29.707,19.293ZM19.5859,28H18V26.4141l5-5L24.5859,23ZM26,21.5859,24.4141,20,26,18.4141,27.5859,20Z" />
              <path d="M17,15H11a3,3,0,0,0-3,3v1h2V18a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1v1h2V18A3,3,0,0,0,17,15Z" />
              <path d="M14,14a4,4,0,1,0-4-4A4,4,0,0,0,14,14Zm0-6a2,2,0,1,1-2,2A2,2,0,0,1,14,8Z" />
              <path d="M12,30H6a2.0021,2.0021,0,0,1-2-2V4A2.0021,2.0021,0,0,1,6,2H22a2.0021,2.0021,0,0,1,2,2V14H22V4H6V28h6Z" />
              <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" className="fill-none" width="32" height="32" />
            </svg>
          </div>
          <div className="text-sm xl:text-lg xl:px-40 lg:px-20 sm:px-10 text-zinc-700 dark:text-slate-200 font-semibold">
            {t('what_for_add_passport')}
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {argument_passport.map((argument) => (
          <div className="flex gap-4 items-center bg-white dark:bg-zinc-900 mt-5 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm" key={argument.id}>
            <div className="items-center justify-center">
              {argument.svg}
            </div>
            <div className="grid gap-y-2">
              <div className="text-base text-zinc-800 dark:text-slate-200 font-semibold">
                {argument.title}
              </div>
              <div className="text-sm text-gray-600 dark:text-zinc-400">
                {argument.descript}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <div className="inline-flex w-full items-center">
          <div className="">
            <span className="whitespace-nowrap text-2xl text-zinc-800 font-bold dark:text-slate-200">{t('basic_information')}</span>
          </div>
          <div className="w-full">
            <div className="ml-auto w-11/12 border-t-2 border-slate-300 dark:border-zinc-800"></div>
          </div>
        </div>

        <div className="grid gap-2 xl:gap-6 2xl:gap-8 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:max-w-7xl mt-2">
          <div className="grid gap-y-2">
            <label className="text-base text-gray-700 dark:text-slate-200">{t('last_name')}:</label>
            <input type="text" name="last_name" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder={t('last_name_ph')} required id="last_name" value={InputValueLastName} onChange={last_name_change} />
          </div>
          <div className="grid gap-y-2">
            <label className="text-base text-gray-700 dark:text-slate-200">{t('first_name')}:</label>
            <input type="text" name="first_name" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder={t('first_name_ph')} required id="first_name" value={InputValueFirstName} onChange={first_name_change} />
          </div>
          <div className="grid gap-y-2">
            <label className="text-base text-gray-700 dark:text-slate-200">{t('middle_name')}:</label>
            <input type="text" name="middle_name" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder={t('middle_name_ph')} required id="middle_name" value={InputValueMiddleName} onChange={middle_name_change} />
          </div>

          <div className="grid gap-y-2">
            <label className="text-base text-gray-700 dark:text-slate-200">{t('date_birth')}:</label>
            <input type="date" name="passport_date_received" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder="XX.XX.XXXX" required id="passport_date_received" value={InputValueDateBirth} onChange={date_birth_change} />
          </div>
          <div className="grid gap-y-2">
            <label className="text-base text-gray-700 dark:text-slate-200">{t('place_of_birth')}:</label>
            <input type="text" name="place_of_birth" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder={t('place_of_birth_ph')} required id="place_of_birth" value={InputValuePlaceBirth} onChange={place_birth_change} />
          </div>
          <div className="grid gap-y-2">
            <label className="text-base text-gray-700 dark:text-slate-200">{t('number_phone')}:</label>
            <input type="text" name="number_phone" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder="X XXX XXX XX XX" required id="number_phone" value={InputValueNumberPhone} onChange={number_phone_change} />
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="inline-flex w-full items-center">
          <div className="">
            <span className="whitespace-nowrap text-2xl text-zinc-800 font-bold dark:text-slate-200">{t('passport_data')}</span>
          </div>
          <div className="w-full">
            <div className="ml-auto w-11/12 border-t-2 border-slate-300 dark:border-zinc-800"></div>
          </div>
        </div>
        <div className="grid gap-2 xl:gap-6 2xl:gap-8 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:max-w-7xl mt-4">
          <div>
            <div className="grid gap-y-2">
              <label className="text-base text-gray-700 dark:text-slate-200">{t('passport_serial_number')}:</label>
              <input type="number" name="passport_serial_number" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder={t('passport_serial_number_ph')} required id="passport_serial_number" value={InputValuePassportSerialNumber} onChange={passport_serial_number_change} />
            </div>
            <div className="text-sm text-orange-700">
              {errorPassportSerialNumber}
            </div>
          </div>
          <div>
            <div className="grid gap-y-2">
              <label className="text-base text-gray-700 dark:text-slate-200">{t('passport_number_number')}:</label>
              <input type="number" name="passport_number_number" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder={t('passport_number_number_ph')} required id="passport_number_number" value={InputValuePassportNumberNumber} onChange={passport_number_number_change} />
            </div>
            <div className="text-sm text-orange-700">
              {errorPassportNumberNumber}
            </div>
          </div>
          <div>
            <div className="grid gap-y-2">
              <label className="text-base text-gray-700 dark:text-slate-200">{t('passport_date_received')}:</label>
              <input type="date" name="passport_date_received" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder="XX.XX.XXXX" required id="passport_date_received" value={InputValuePassportReceived} onChange={passport_received_change} />
            </div>
            <div className="text-sm text-orange-700">
            </div>
          </div>

          <div>
            <div className="grid gap-y-2">
              <label className="text-base text-gray-700 dark:text-slate-200">{t('passport_recieved_by')}:</label>
              <input type="text" name="passport_recieved_by" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder={t('passport_recieved_by_ph')} required id="passport_recieved_by" value={InputValuePassportRecievedBy} onChange={passport_recieved_by_change} />
            </div>
            <div className="text-sm text-orange-700">
            </div>
          </div>
          <div>
            <div className="grid gap-y-2">
              <label className="text-base text-gray-700 dark:text-slate-200">{t('passport_office_id')}:</label>
              <input type="number" name="passport_office_id" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder={t('passport_office_id_ph')} required id="passport_office_id" value={InputValuePassportOfficeId} onChange={passport_office_id_change} />
            </div>
            <div className="text-sm text-orange-700">
              {errorPassportOfficeId}
            </div>
          </div>
          <div>
            <div className="grid gap-y-2">
              <label className="text-base text-gray-700 dark:text-slate-200">{t('registration_address')}:</label>
              <input type="text" name="registration_address" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder={t('registration_address_ph')} required id="registration_address" value={InputValueRegistrationAddres} onChange={registration_addres_change} />
            </div>
            <div className="text-sm text-orange-700">

            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="inline-flex w-full items-center">
          <div className="">
            <span className="whitespace-nowrap text-2xl text-zinc-800 font-bold dark:text-slate-200">{t('bank_requisites')}</span>
          </div>
          <div className="w-full">
            <div className="ml-auto w-11/12 border-t-2 border-slate-300 dark:border-zinc-800"></div>
          </div>
        </div>

        <div className="grid gap-2 xl:gap-6 2xl:gap-8 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:max-w-7xl mt-4">
          <div className="grid gap-y-2">
            <label className="text-base text-gray-700 dark:text-slate-200">{t('bank_account_number')}:</label>
            <input type="number" name="bank_account_number" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder={t('bank_account_number_ph')} required id="bank_account_number" value={InputValueBankAccountNumber} onChange={bank_account_number_change} />
          </div>
          <div className="grid gap-y-2">
            <label className="text-base text-gray-700 dark:text-slate-200">{t('bank_name')}:</label>
            <input type="text" name="bank_name" className="outline-none bg-white dark:bg-zinc-900 text-base rounded-xl border-2 border-slate-300 dark:border-zinc-800 p-2" placeholder={t('bank_name_ph')} required id="bank_name" value={InputValueBankName} onChange={bank_name_change} />
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="inline-flex w-full items-center">
          <div className="">
            <span className="whitespace-nowrap text-2xl text-zinc-800 font-bold dark:text-slate-200">{t('sign_the_contract')}</span>
          </div>
          <div className="w-full">
            <div className="ml-auto w-11/12 border-t-2 border-slate-300 dark:border-zinc-800"></div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-zinc-800 dark:border-gray-300 inline-flex mt-5">
          <canvas id="signature" ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={endDrawing} onMouseLeave={endDrawing} width={300} height={150}></canvas>
        </div>
      </div>

      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:items-center mt-10 mb-10">
        <div className=" gap-y-1">
          <div className="text-sm text-slate-2000 font-bold dark:text-zinc-400">{t('agreement')}</div>
        </div>
        <button onClick={handlerSubmit} className="select-none inline-flex rounded-md items-center  px-2 py-2 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">{t('send_to_moderate')}</button>
      </div>
    </form>
  )
}

