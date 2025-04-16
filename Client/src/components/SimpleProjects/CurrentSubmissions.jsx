import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaSearch, FaSort, FaExternalLinkAlt, FaFilter } from 'react-icons/fa';
import Loader from '../Loader';
import '../../styles/SimpleProject/CurrentSubmissions.css';

const CurrentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    project: '',
    venue: ''
  });

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        let response = null;
        if(user.role === 'faculty') response = await axios.get(`/api/v1/projects/${user?.id}`);
        else response = await axios.get(`/api/v1/projects/student/${user?.id}`);
        // Filter to only include projects with status "under-review"
        
        const underReviewProjects = response.data.filter(
          project => project.status === 'under-review'
        );
        
        setSubmissions(underReviewProjects);
        setFilteredSubmissions(underReviewProjects);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch submission data');
      } finally {
        setLoading(false);
      }
    };

    if(user) fetchSubmissions();
  }, []);

  useEffect(() => {
    let results = submissions;

    // Apply search term filter
    if (searchTerm) {
      results = results.filter(submission =>
        submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.lead_author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply individual filters
    if (filters.name) {
      results = results.filter(submission =>
        submission.lead_author.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.project) {
      results = results.filter(submission =>
        submission.name.toLowerCase().includes(filters.project.toLowerCase())
      );
    }
    if (filters.venue) {
      results = results.filter(submission =>
        submission.venue.toLowerCase().includes(filters.venue.toLowerCase())
      );
    }

    setFilteredSubmissions(results);
  }, [searchTerm, filters, submissions]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredSubmissions].sort((a, b) => {
      // Handle nested objects and null values
      const valueA = key.includes('.') ? 
        key.split('.').reduce((o, i) => o && o[i], a) : a[key];
      const valueB = key.includes('.') ? 
        key.split('.').reduce((o, i) => o && o[i], b) : b[key];

      if (valueA == null) return direction === 'asc' ? 1 : -1;
      if (valueB == null) return direction === 'asc' ? -1 : 1;
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredSubmissions(sortedData);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      project: '',
      venue: ''
    });
    setSearchTerm('');
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="submissions-error">
        {error}
      </div>
    );
  }

  return (
    <div className="submissions-container">
      <div className="submissions-header">
        <h2>Current Submissions</h2>
        <div className="submissions-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className={`filter-btn ${filterOpen ? 'active' : ''}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <FaFilter /> Filters
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Author Name</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Filter by author..."
            />
          </div>
          <div className="filter-group">
            <label>Project Name</label>
            <input
              type="text"
              name="project"
              value={filters.project}
              onChange={handleFilterChange}
              placeholder="Filter by project..."
            />
          </div>
          <div className="filter-group">
            <label>Venue</label>
            <input
              type="text"
              name="venue"
              value={filters.venue}
              onChange={handleFilterChange}
              placeholder="Filter by venue..."
            />
          </div>
          <button className="reset-filters" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}

      {filteredSubmissions.length === 0 ? (
        <div className="no-submissions">
          No submissions found matching your criteria
        </div>
      ) : (
        <div className="submissions-table-container">
          <table className="submissions-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('lead_author.name')}>
                  Lead Author <FaSort className="sort-icon" />
                </th>
                <th onClick={() => handleSort('name')}>
                  Project Name <FaSort className="sort-icon" />
                </th>
                <th onClick={() => handleSort('venue')}>
                  Venue <FaSort className="sort-icon" />
                </th>
                <th onClick={() => handleSort('date_of_submission')}>
                  Last Submitted On <FaSort className="sort-icon" />
                </th>
                <th onClick={() => handleSort('next_deadline')}>
                  Next Deadline <FaSort className="sort-icon" />
                </th>
                <th>Remarks</th>
                <th>Paper URL</th>
                <th>Submission URL</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission._id}>
                  <td>{submission.lead_author?.name || 'N/A'}</td>
                  <td>{submission.name}</td>
                  <td>{submission.venue}</td>
                  <td>{formatDate(submission.date_of_submission)}</td>
                  <td>
                    {formatDate(submission.next_deadline)}
                    {submission.remarks && (
                      <span className="remarks-tooltip" data-tooltip={submission.remarks}>
                        *
                      </span>
                    )}
                  </td>
                  <td>
                    {submission.paper_url ? (
                      <a 
                        href={submission.paper_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="url-link"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    {submission.submission_url ? (
                      <a 
                        href={submission.submission_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="url-link"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CurrentSubmissions;