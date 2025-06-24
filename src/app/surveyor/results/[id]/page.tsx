import { notFound } from "next/navigation";
import { mockSurveys } from "@/data/dashboard-data";
import { mockSurveyResults } from "@/data/results-data";

interface ResultsPageProps {
  params: { id: string };
}

export default async function SurveyResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  const survey = mockSurveys.find((s) => s.id === id);
  if (!survey) notFound();

  // Only allow results for non-draft surveys
  if (survey.status === "draft") notFound();

  const results = mockSurveyResults.filter((r) => r.surveyId === id);
  const questions = survey.questionsData || [];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">
        Survey Results: {survey.title}
      </h1>
      {results.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">
          No responses yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Respondent
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Submitted At
                </th>
                {questions.map((q) => (
                  <th
                    key={q.id}
                    className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400"
                  >
                    {q.questionText}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((resp) => (
                <tr key={resp.id}>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                    {resp.respondent}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(resp.submittedAt).toLocaleString()}
                  </td>
                  {questions.map((q) => (
                    <td
                      key={q.id}
                      className="px-4 py-2 text-sm text-gray-900 dark:text-white"
                    >
                      {Array.isArray(resp.answers[q.id])
                        ? (resp.answers[q.id] as string[]).join(", ")
                        : resp.answers[q.id] || (
                            <span className="text-gray-400">-</span>
                          )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
