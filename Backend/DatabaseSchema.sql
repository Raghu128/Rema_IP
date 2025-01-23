-- User Table
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    status BOOLEAN DEFAULT TRUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- SponsorProject Table
CREATE TABLE "SponsorProject" (
    srpId SERIAL PRIMARY KEY,
    agency VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    cfp_url VARCHAR(2083),
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    start_date DATE,
    duration INT CHECK (duration > 0),
    budget DECIMAL(15, 2) CHECK (budget >= 0),
    remarks TEXT
);

-- Supervisor Table
CREATE TABLE "Supervisor" (
    faculty_id INT NOT NULL PRIMARY KEY,
    student_id INT NOT NULL,
    joining DATE,
    thesis_title VARCHAR(255),
    committee JSONB, -- Stores an array of faculty IDs
    stipend DECIMAL(10, 2) CHECK (stipend >= 0),
    funding_source VARCHAR(255),
    srpId INT,
    FOREIGN KEY (faculty_id) REFERENCES "User" (id),
    FOREIGN KEY (student_id) REFERENCES "User" (id),
    FOREIGN KEY (srpId) REFERENCES "SponsorProject" (srpId)
);

-- Projects Table
CREATE TABLE "Projects" (
    id SERIAL PRIMARY KEY,
    faculty_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    sub_domain VARCHAR(255),
    creation_date DATE,
    end_date DATE,
    team JSONB, -- Stores an array of student IDs
    lead_author INT,
    status VARCHAR(10) DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'cancelled')),
    venue VARCHAR(255),
    date_of_submission DATE,
    next_deadline DATE,
    remarks TEXT,
    paper_url VARCHAR(2083),
    submission_url VARCHAR(2083),
    FOREIGN KEY (faculty_id) REFERENCES "User" (id),
    FOREIGN KEY (lead_author) REFERENCES "User" (id)
);

-- MinutesOfMeeting Table
CREATE TABLE "MinutesOfMeeting" (
    id SERIAL PRIMARY KEY,
    pid INT NOT NULL,
    text TEXT NOT NULL,
    added_by INT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (pid) REFERENCES "Projects" (id),
    FOREIGN KEY (added_by) REFERENCES "User" (id)
);

-- VenueList Table
CREATE TABLE "VenueList" (
    id SERIAL PRIMARY KEY,
    venue VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    url VARCHAR(2083),
    added_by INT NOT NULL,
    date DATE,
    abstract_submission DATE,
    paper_submission DATE,
    author_response DATE,
    meta_review DATE,
    notification DATE,
    commitment DATE,
    main_conference_start DATE,
    main_conference_end DATE,
    location VARCHAR(255),
    time_zone VARCHAR(255),
    view JSONB, -- Array of User IDs
    FOREIGN KEY (added_by) REFERENCES "User" (id)
);

-- Notification Table
CREATE TABLE "Notification" (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    creation_date DATE NOT NULL,
    due_date DATE,
    priority VARCHAR(10) DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high')),
    added_by INT NOT NULL,
    view JSONB, -- JSON of user IDs with read status
    FOREIGN KEY (added_by) REFERENCES "User" (id)
);



-- Equipment Table
CREATE TABLE "Equipment" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ownership INT NOT NULL,
    funding_by_srp_id INT NULL,
    date_of_purchase DATE,
    location VARCHAR(255),
    amount DECIMAL(10, 2) CHECK (amount >= 0),
    status VARCHAR(15) DEFAULT 'available' CHECK (status IN ('available', 'in use', 'maintenance', 'surrendered')),
    remarks VARCHAR(255),
    FOREIGN KEY (ownership) REFERENCES "User" (id),
    FOREIGN KEY (funding_by_srp_id) REFERENCES "SponsorProject" (srpId)
);

-- FinanceBudget Table
CREATE TABLE "FinanceBudget" (
    srp_id INT NOT NULL,
    year INT NOT NULL, 
    manpower DECIMAL(15, 2) CHECK (manpower >= 0),
    pi_compenstion DECIMAL(15, 2) CHECK (pi_compenstion >= 0),
    equipment DECIMAL(15, 2) CHECK (equipment >= 0),
    travel DECIMAL(15, 2) CHECK (travel >= 0),
    expenses DECIMAL(15, 2) CHECK (expenses >= 0),
    outsourcing DECIMAL(15, 2) CHECK (outsourcing >= 0),
    contingency DECIMAL(15, 2) CHECK (contingency >= 0),
    consumable DECIMAL(15, 2) CHECK (consumable >= 0),
    others DECIMAL(15, 2) CHECK (others >= 0),
    overhead DECIMAL(15, 2) CHECK (overhead >= 0),
    gst DECIMAL(15, 2) CHECK (gst >= 0),
    status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
    PRIMARY KEY (srp_id, year),
    FOREIGN KEY (srp_id) REFERENCES "SponsorProject" (srpId)
);

-- Expense Table
CREATE TABLE "Expense" (
    srp_id INT NOT NULL,
    expense_id SERIAL PRIMARY KEY,
    item VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount >= 0),
    head VARCHAR(255),
    payment_date DATE,
    FOREIGN KEY (srp_id) REFERENCES "SponsorProject" (srpId)
);
