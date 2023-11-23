import React from 'react'
import IssueItem from './IssueItem'
import BookSearchItem from './BookSearchItem'

export default function SearchResultItem(props) {
  let item = null
  if (props.option === 'issue') {
    item = <IssueItem issueInfo={props.info} />
  } else if (props.option === 'book') {
    item = <BookSearchItem bookInfo={props.info} />
  }
  return item
}
