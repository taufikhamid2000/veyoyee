-- Debug script to check what surveys exist in the database
-- Run this in your Supabase SQL editor

-- List all surveys with their IDs
SELECT 
  id,
  title,
  type,
  status,
  created_at,
  updated_at
FROM veyoyee.surveys
ORDER BY created_at DESC;

-- Check if specific survey IDs exist
SELECT 
  id,
  title,
  status
FROM veyoyee.surveys 
WHERE id IN (
  'cd1514c1-87c2-4926-9f34-c7f5e01c0536',
  'fe5dbc93-d715-4bca-9550-8d513ebf0959'
);

-- Count total surveys
SELECT COUNT(*) as total_surveys FROM veyoyee.surveys;

-- Check if the failing survey has questions
SELECT 
  q.id,
  q.survey_id,
  q.question_text,
  q.type,
  q.required,
  q.display_order
FROM veyoyee.questions q
WHERE q.survey_id = 'cd1514c1-87c2-4926-9f34-c7f5e01c0536'
ORDER BY q.display_order;

-- Check if the working survey has questions
SELECT 
  q.id,
  q.survey_id,
  q.question_text,
  q.type,
  q.required,
  q.display_order
FROM veyoyee.questions q
WHERE q.survey_id = 'fe5dbc93-d715-4bca-9550-8d513ebf0959'
ORDER BY q.display_order;

-- Count questions for both surveys
SELECT 
  survey_id,
  COUNT(*) as question_count
FROM veyoyee.questions 
WHERE survey_id IN (
  'cd1514c1-87c2-4926-9f34-c7f5e01c0536',
  'fe5dbc93-d715-4bca-9550-8d513ebf0959'
)
GROUP BY survey_id;

-- Check question options for the failing survey's multipleChoice question
SELECT 
  qo.id,
  qo.question_id,
  qo.option_text,
  qo.display_order
FROM veyoyee.question_options qo
JOIN veyoyee.questions q ON qo.question_id = q.id
WHERE q.survey_id = 'cd1514c1-87c2-4926-9f34-c7f5e01c0536'
  AND q.type = 'multipleChoice'
ORDER BY qo.display_order;

-- Check question options for the working survey's multipleChoice and checkboxList questions
SELECT 
  qo.id,
  qo.question_id,
  qo.option_text,
  qo.display_order,
  q.question_text
FROM veyoyee.question_options qo
JOIN veyoyee.questions q ON qo.question_id = q.id
WHERE q.survey_id = 'fe5dbc93-d715-4bca-9550-8d513ebf0959'
  AND (q.type = 'multipleChoice' OR q.type = 'checkboxList')
ORDER BY qo.display_order;

-- Check RLS policies on surveys table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'surveys' AND schemaname = 'veyoyee';

-- Check current user and their permissions
SELECT 
  current_user,
  session_user,
  current_setting('role') as current_role;

-- Check if the failing survey exists with different permissions
-- Run this as the service role to bypass RLS
SELECT 
  id,
  title,
  status,
  created_by
FROM veyoyee.surveys 
WHERE id = 'cd1514c1-87c2-4926-9f34-c7f5e01c0536';
