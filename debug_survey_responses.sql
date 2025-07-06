-- Debug queries to check survey response data

-- 1. Check individual_responses table
SELECT 
    id,
    survey_id,
    respondent_id,
    started_at,
    completed_at,
    is_complete
FROM veyoyee.individual_responses 
ORDER BY started_at DESC 
LIMIT 10;

-- 2. Check response_answers table
SELECT 
    ra.id,
    ra.response_id,
    ra.question_id,
    ra.answer_text,
    ra.selected_options,
    ra.created_at
FROM veyoyee.response_answers ra
ORDER BY ra.created_at DESC 
LIMIT 10;

-- 3. Check if there are any answers for recent responses
SELECT 
    ir.id as response_id,
    ir.respondent_id,
    ir.completed_at,
    COUNT(ra.id) as answer_count
FROM veyoyee.individual_responses ir
LEFT JOIN veyoyee.response_answers ra ON ir.id = ra.response_id
WHERE ir.completed_at IS NOT NULL
GROUP BY ir.id, ir.respondent_id, ir.completed_at
ORDER BY ir.completed_at DESC
LIMIT 10;

-- 4. Check for any database errors or constraint violations
SELECT 
    ir.id as response_id,
    ir.survey_id,
    ir.respondent_id,
    ir.is_complete,
    ra.id as answer_id,
    ra.question_id,
    ra.answer_text
FROM veyoyee.individual_responses ir
LEFT JOIN veyoyee.response_answers ra ON ir.id = ra.response_id
WHERE ir.respondent_id LIKE '%55cc8013'
ORDER BY ir.started_at DESC;
