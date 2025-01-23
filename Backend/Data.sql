-- Insert into User table
INSERT INTO "User" (id, name, role, status, email, password) VALUES
(1, 'SHad', 'faculty', TRUE, 'shad.akhtar@iiitd.ac.in', '1234'),
(2, 'Abdullah', 'student', TRUE, 'a@iiitd.ac.in', '234134'),
(3, 'Het', 'PHD', TRUE, 'h@iiitd.ac.in', '234'),
(4, 'proff', 'faculty', TRUE, 'proff@iiitd.ac.in', '123444'),
(5, 'John Doe', 'MTECH', TRUE, 'john.doe@iiitd.ac.in', 'pass123'),
(6, 'Jane Smith', 'faculty', TRUE, 'jane.smith@iiitd.ac.in', 'pass234'),
(7, 'Alice Cooper', 'admin', TRUE, 'alice.admin@iiitd.ac.in', 'admin123'),
(8, 'Bob Marley', 'INTERN', FALSE, 'bob.marley@iiitd.ac.in', 'pass345');

-- intern, project staff, add in user role

-- Insert into SponsorProject table
INSERT INTO "SponsorProject" (srpId, agency, title, cfp_url, status, start_date, duration, budget, remarks) VALUES
(221, 'SERB', 'Deception', 'ads.com', 'active', '2022-12-22', 3, 390000, '1st Installment received'),
(222, 'DST', 'AI in Education', 'dst.edu.com', 'inactive', '2021-05-15', 24, 250000, 'Awaiting final approval'),
(223, 'SERB', 'Climate Change Research', 'climate-serb.com', 'active', '2023-06-10', 36, 500000, 'Phase 2 initiated'),
(224, 'ICMR', 'Healthcare Analytics', 'icmr-health.com', 'active', '2024-01-20', 12, 150000, 'Ongoing');

-- Insert into Supervisor table
INSERT INTO "Supervisor" (faculty_id, student_id, joining, thesis_title, committee, stipend, funding_source, srpId) VALUES
(1, 2, '2024-01-01', 'Accessing Trust in Mental Health', '[4]', 37000, 'SERB', 221),
(6, 5, '2023-07-01', 'AI for Social Good', '[1, 4]', 35000, 'DST', 222),
(4, 3, '2023-01-10', 'Trust in Decision Making', '[6]', 40000, 'SERB', 221);

-- Insert into Projects table
INSERT INTO "Projects" (id, faculty_id, name, domain, sub_domain, creation_date, end_date, team, lead_author, status, venue, date_of_submission, next_deadline, remarks, paper_url, submission_url) VALUES
(1, 1, 'Faithfulness', 'Mental Health', NULL, '2024-08-01', NULL, '[2, 3]', 2, 'ongoing', 'ARR', '2025-02-15', NULL, NULL, 'abc.com', 'xyz.com'),
(2, 6, 'EdTech Revolution', 'Education', 'E-Learning', '2024-09-01', NULL, '[5]', 5, 'ongoing', 'ICML', '2025-03-01', '2025-01-20', 'Research on AI in Education', 'icml.edu.com', 'submission.icml.com'),
(3, 6, 'Healthcare Insights', 'Healthcare', 'Analytics', '2024-07-15', '2025-06-30', '[2, 5]', 3, 'completed', 'NeurIPS', '2024-12-10', NULL, 'AI-assisted diagnosis project', 'neurips.com', 'submit.neurips.com');


-- Insert into MinutesOfMeeting table
INSERT INTO "MinutesOfMeeting" (id, pid, text, added_by, date) VALUES
(1, 1, 'Abdullah will start writing paper. Complete first draft by 31st Jan', 2, '2025-01-20'),
(2, 2, 'John will refine datasets. Deadline: 15th Feb', 5, '2025-01-22'),
(3, 3, 'Final results to be reviewed. Paper draft by 25th Jan.', 6, '2025-01-15');


-- Insert into VenueList table
INSERT INTO "VenueList" (id, venue, year, url, added_by, date, abstract_submission, paper_submission, author_response, meta_review, notification, commitment, main_conference_start, main_conference_end, location, time_zone, view) VALUES
(1, 'ARR-ACL', 2025, 'abc.com', 2, '2024-11-15', '2025-01-15', '2025-01-15', NULL, NULL, NULL, NULL, '2025-07-27', '2025-08-01', 'Vienna, Austria', 'UTC -12', '[1, 2, 3]'),
(2, 'Interspeech', 2025, 'afd.com', 1, '2024-10-10', '2025-01-12', '2025-01-12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[1]'),
(3, 'ICML', 2025, 'icml.edu.com', 6, '2024-09-01', '2025-02-01', '2025-02-15', NULL, NULL, NULL, NULL, '2025-07-10', '2025-07-15', 'New York, USA', 'UTC -5', '[1, 5, 6]'),
(4, 'NeurIPS', 2024, 'neurips.org', 3, '2023-11-20', '2024-01-30', '2024-02-10', NULL, NULL, NULL, NULL, NULL, NULL, 'Lisbon, Portugal', 'UTC +1', '[2, 6]');


-- Insert into Notification table
INSERT INTO "Notification" (id, type, text, creation_date, due_date, priority, added_by, view) VALUES
(1, 'Review', 'Megha Thesis', '2025-01-15', NULL, 'high', 1, '[1]'),
(2, 'Review Submit', 'OSM', '2024-12-15', '2025-01-31', 'medium', 1, '[1]'),
(3, 'Review Request', 'ARR', '2024-12-20', '2025-02-08', 'medium', 1, '[1, 2]'),
(4, 'Budget Update', 'Update on SERB Funding', '2024-12-10', '2025-01-20', 'high', 7, '[1, 6]'),
(5, 'Equipment Update', 'Server Maintenance Scheduled', '2025-01-10', NULL, 'low', 1, '[1, 3]');


-- Insert into Equipment table
INSERT INTO "Equipment" (id, name, ownership, funding_by_srp_id, date_of_purchase, location, amount, status, remarks) VALUES
(1, 'Server', 1, 221, '2021-08-01', 'IT Server room', 100000, 'available', 'Workshop needs to be conducted'),
(2, 'High-Performance Laptop', 5, 223, '2023-08-10', 'Lab A', 150000, 'in use', 'Assigned to project lead'),
(3, '3D Printer', 6, NULL, '2024-05-20', 'Lab B', 200000, 'maintenance', 'Pending repair approval');


-- Insert into FinanceBudget table
INSERT INTO "FinanceBudget" (srp_id, year, manpower, pi_compenstion, equipment, travel, expenses, outsourcing, contingency, consumable, others, overhead, gst, status) VALUES
(221, 1, 50000, 0, 213423, 12112, NULL, 0, 1213, 123123, 0, 12321134, 0, 'approved'),
(221, 2, 50000, 0, 213423, 12112, NULL, 0, 1213, 123123, 0, 12321134, 0, 'pending'),
(222, 2024, 60000, 10000, 200000, 15000, 3000, 5000, 1000, 12000, 3000, 80000, 5000, 'pending'),
(223, 2025, 70000, 15000, 250000, 20000, 5000, 8000, 2000, 15000, 5000, 100000, 10000, 'approved');


-- Insert into Expense table
INSERT INTO "Expense" (srp_id, expense_id, item, amount, head, payment_date) VALUES
(221, 1, 'Stipend to Abdullah (Dec 2024)', 37000, 'Manpower', '2025-01-01'),
(221, 2, 'GPT credits', 20000, 'Consumable', '2024-12-01'),
(222, 3, 'Travel to Conference', 12000, 'Travel', '2025-01-10'),
(223, 4, 'Data Annotation Tools', 18000, 'Consumable', '2024-11-01');
