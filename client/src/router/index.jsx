import { Route, Routes, Navigate } from 'react-router-dom'

import Issues from '../pages/Issues'
import Books from '../pages/Books'
import Interviews from '../pages/Interviews'
import AddIssue from '../pages/AddIssue'
import IssueDetail from '../pages/IssueDetail'
import SearchPage from '../pages/SearchPage'
import BookDetail from '../pages/BookDetail'
import Personal from '../pages/Personal'

function RouterConfig() {
  return (
    <Routes>
      <Route path="/issues" element={<Issues />} />
      <Route path="/issues/:id" element={<IssueDetail />} />
      <Route path="/addIssue" element={<AddIssue />} />
      <Route path="/books" element={<Books />} />
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/interviews" element={<Interviews />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/personal" element={<Personal />} />
      <Route path="/" element={<Navigate to="/issues" replace />} />
    </Routes>
  )
}
export default RouterConfig
