import { useTranslations } from "next-intl"

export default function FAQ() {
  const t = useTranslations('questions')
  const questions = [
    {
      id: 1,
      question: t('question_1'),
      Answer: t('question_1_answer')
    },
    {
      id: 2,
      question: t('question_2'),
      Answer: t('question_2_answer')
    },
    {
      id: 3,
      question: t('question_3'),
      Answer: t('question_3_answer')
    },
    {
      id: 4,
      question: t('question_4'),
      Answer: t('question_4_answer')
    },
    {
      id: 5,
      question: t('question_5'),
      Answer: t('question_5_answer')
    },
    {
      id: 6,
      question: t('question_6'),
      Answer: t('question_6_answer')
    },
  ]
  return (
    <div className='w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto justify-center py-20'>
      <h1 className="font-semibold text-zinc-800 text-3xl lg:text-4xl text-center dark:text-slate-50">
        {t('frequently_asked_questions')}
      </h1>
      <div className='w-full mx-auto mt-10 justify-center'>
        <div className='grid gap-12 lg:grid-cols-2 2xl:grid-cols-3 justify-center py-10'>
          {questions.map((question) => (
            <div className="flex flex-col gap-y-1" key={question.id} data-aos="fade-up" data-aos-delay="100">
              <span className="font-medium text-zinc-800 sm:text-2xl text-left dark:text-slate-200">
                {question.question}
              </span>
              <span className="text-zinc-400 sm:text-base text-left dark:text-zinc-400">
                {question.Answer}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}