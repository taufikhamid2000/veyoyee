-- Query to fetch survey and all related data for survey ID: fe5dbc93-d715-4bca-9550-8d513ebf0959

-- 1. Main Survey Information
SELECT 'SURVEY' as data_type, * FROM veyoyee.surveys 
WHERE id = 'fe5dbc93-d715-4bca-9550-8d513ebf0959';

-- 2. Questions for this survey
SELECT 'QUESTIONS' as data_type, * FROM veyoyee.questions 
WHERE survey_id = 'fe5dbc93-d715-4bca-9550-8d513ebf0959'
ORDER BY display_order;

-- 3. Question Options (for multiple choice questions)
SELECT 'QUESTION_OPTIONS' as data_type, qo.* 
FROM veyoyee.question_options qo
JOIN veyoyee.questions q ON qo.question_id = q.id
WHERE q.survey_id = 'fe5dbc93-d715-4bca-9550-8d513ebf0959'
ORDER BY qo.question_id, qo.display_order;

-- 4. Survey Responses (actual submissions)
SELECT 'RESPONSES' as data_type, * FROM veyoyee.responses 
WHERE survey_id = 'fe5dbc93-d715-4bca-9550-8d513ebf0959'
ORDER BY submitted_at DESC;

-- 5. Individual Answers
SELECT 'ANSWERS' as data_type, a.* 
FROM veyoyee.answers a
JOIN veyoyee.responses r ON a.response_id = r.id
WHERE r.survey_id = 'fe5dbc93-d715-4bca-9550-8d513ebf0959'
ORDER BY a.created_at;

-- 6. Survey Response Aggregates (if using the newer table)
SELECT 'SURVEY_RESPONSES_AGGREGATES' as data_type, * FROM veyoyee.survey_responses 
WHERE survey_id = 'fe5dbc93-d715-4bca-9550-8d513ebf0959'
ORDER BY response_date DESC;

-- 7. Complete view with actual columns
SELECT 
    'COMPLETE_VIEW' as data_type,
    s.title as survey_title,
    s.type as survey_type,
    s.status as survey_status,
    s.min_respondents,
    s.max_respondents,
    s.reward_amount,
    q.question_text,
    q.type as question_type,
    q.required as question_required,
    q.display_order as question_order,
    qo.option_text,
    qo.display_order as option_order,
    r.status as response_status,
    r.reputation_score,
    r.submitted_at,
    a.answer_text
FROM veyoyee.surveys s
LEFT JOIN veyoyee.questions q ON s.id = q.survey_id
LEFT JOIN veyoyee.question_options qo ON q.id = qo.question_id
LEFT JOIN veyoyee.responses r ON s.id = r.survey_id
LEFT JOIN veyoyee.answers a ON r.id = a.response_id AND q.id = a.question_id
WHERE s.id = 'fe5dbc93-d715-4bca-9550-8d513ebf0959'
ORDER BY q.display_order, qo.display_order, r.submitted_at;

-- 8. Detailed breakdown by question
SELECT 
    'QUESTION_BREAKDOWN' as data_type,
    q.id as question_id,
    q.question_text,
    q.type as question_type,
    q.display_order,
    COUNT(qo.id) as options_count,
    STRING_AGG(qo.option_text, ' | ' ORDER BY qo.display_order) as all_options
FROM veyoyee.surveys s
JOIN veyoyee.questions q ON s.id = q.survey_id
LEFT JOIN veyoyee.question_options qo ON q.id = qo.question_id
WHERE s.id = 'fe5dbc93-d715-4bca-9550-8d513ebf0959'
GROUP BY q.id, q.question_text, q.type, q.display_order
ORDER BY q.display_order;

-- 9. Summary statistics with actual columns
SELECT 
    'SUMMARY_STATS' as data_type,
    COUNT(DISTINCT q.id) as total_questions,
    COUNT(DISTINCT qo.id) as total_options,
    COUNT(DISTINCT r.id) as total_responses,
    COUNT(DISTINCT a.id) as total_answers,
    MIN(r.submitted_at) as first_response_date,
    MAX(r.submitted_at) as last_response_date,
    AVG(r.reputation_score) as avg_reputation_score
FROM veyoyee.surveys s
LEFT JOIN veyoyee.questions q ON s.id = q.survey_id
LEFT JOIN veyoyee.question_options qo ON q.id = qo.question_id
LEFT JOIN veyoyee.responses r ON s.id = r.survey_id
LEFT JOIN veyoyee.answers a ON r.id = a.response_id
WHERE s.id = 'fe5dbc93-d715-4bca-9550-8d513ebf0959';