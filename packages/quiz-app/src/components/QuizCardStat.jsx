import React from 'react'

const QuizCardStat = ({ users, questions, duration }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}
    >
      <div
        style={{
          textAlign: 'center'
        }}
      >
        <p
          style={{
            marginBottom: '0.2rem',
            color: '#6e6b7b',
            fontSize: '.850rem',
            fontWeight: 400
          }}
        >
          Questions
        </p>
        <span style={{ fontSize: '1.5rem', fontWeight: 500 }}>{questions}</span>
      </div>
      <div
        style={{
          textAlign: 'center'
        }}
      >
        <p
          style={{
            marginBottom: '0.2rem',
            color: '#6e6b7b',
            fontSize: '.850rem',
            fontWeight: 400
          }}
        >
          Users
        </p>
        <span style={{ fontSize: '1.5rem', fontWeight: 500 }}>
          {users ? users : '-'}
        </span>
      </div>
      <div
        style={{
          textAlign: 'center'
        }}
      >
        <p
          style={{
            marginBottom: '0.2rem',
            color: '#6e6b7b',
            fontSize: '.850rem',
            fontWeight: 400
          }}
        >
          Duration
        </p>
        <span
          style={{
            fontSize: '1.5rem',
            fontWeight: 500,
            color: 'green'
          }}
        >
          {duration} min
        </span>
      </div>
    </div>
  )
}

export default QuizCardStat
