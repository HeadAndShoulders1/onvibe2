"use client"
import Interested from "@/components/main/interested/page";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import AOS from 'aos'
import 'aos/dist/aos.css';
import Reviews from "@/components/main/reviews/page";
import StoresOther from "@/components/main/platforms_store/page";


const Questions = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
        })
    }, [])
    const t = useTranslations('questions');
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
        {
            id: 7,
            question: t('question_7'),
            Answer: t('question_7_answer')
        },
        {
            id: 8,
            question: t('question_8'),
            Answer: t('question_8_answer')
        },
        {
            id: 9,
            question: t('question_9'),
            Answer: t('question_9_answer')
        },
        {
            id: 10,
            question: t('question_10'),
            Answer: t('question_10_answer')
        },
        {
            id: 11,
            question: t('question_11'),
            Answer: t('question_11_answer')
        },
        {
            id: 12,
            question: t('question_12'),
            Answer: t('question_12_answer')
        },

    ]
    const md = useTranslations('metadata')
    return (
        <div className="w-full grid lg:gap-y-20 gap-y-8">
            <head>
                <title>{md('questions')}</title>
                <meta name="description" content={md('questions_desc')} />
            </head>
            <div className="mx-auto max-w-2xl h-screen flex items-center" data-aos="fade-up" data-aos-delay="100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-6xl dark:text-slate-200">
                        {t('frequently_asked_questions')}
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-zinc-400">
                        {t('frequently_asked_questions_detail')}
                    </p>
                </div>
            </div>
            <div className="py-20">
                <div className='flex w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto justify-center'>
                    <div className='grid gap-6 lg:grid-cols-2 justify-center py-10'>
                        {questions.map((question) => (
                            <div key={question.id} data-aos="fade-up" data-aos-delay="100">
                                <h1 className="font-bold tracking-tight text-white-900 sm:text-2xl text-left dark:text-slate-200">
                                    {question.question}
                                </h1>
                                <h1 className="tracking-tight text-slate-400 sm:text-1xl text-left dark:text-zinc-400 py-3">
                                    {question.Answer}
                                </h1>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <StoresOther />
            <Reviews />
            <Interested />

        </div>
    )
}

export default Questions