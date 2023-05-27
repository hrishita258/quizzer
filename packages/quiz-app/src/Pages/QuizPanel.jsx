import {
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Image,
  message,
  Modal,
  Progress,
  Row
} from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { BsEye } from 'react-icons/bs'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'

import { getRequest } from '../axios/axiosMethods'
import PageLayout from '../components/PageLayout'
import { useAppState } from '../state/AppState'

const STATUS_BADGES = [
  { name: 'Completed', bgColor: '#0cb66e', color: '#FFF' },
  {
    name: 'Not Answered',
    bgColor: '#e7eaef',
    color: '#142439'
  },
  { name: 'Current', bgColor: '#142439', color: '#FFF' }
]

var INITIAL_COUNT = 0

const QuizPanel = () => {
  const [quizData, setQuizData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [rulesDrawerOpen, setRulesDrawerOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [markedForReview, setMarkedForReview] = useState({})
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [violations, setViolations] = useState([])
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([])

  const [startQuiz, setStartQuiz] = useState(
    localStorage.getItem('quizStarted') &&
      Boolean(localStorage.getItem('quizStarted')) === true
      ? true
      : false
  )

  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(
    () => startQuiz
  )

  const params = useParams()
  const { appState } = useAppState()

  const secondsToDisplay = secondsRemaining % 60
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60

  useEffect(() => {
    getRequest('quizzes/' + params.quizId)
      .then(response => {
        if (response.status === 200) {
          if (response.data.status) {
            let duration = response.data.result.duration

            setQuizData(response.data.result)

            if (duration !== undefined && duration !== null) {
              let count = localStorage.getItem('currentCount')
              INITIAL_COUNT =
                count !== undefined && count !== null
                  ? parseInt(count)
                  : duration * 60
              setSecondsRemaining(
                count !== undefined && count !== null
                  ? parseInt(count)
                  : duration * 60
              )
            }
          }
          setLoading(false)
        } else {
        }
      })
      .catch(err => {
        setLoading(false)
        message.error(
          err.toString() || 'internal server error please try agin later'
        )
      })
  }, [params])

  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1)
        localStorage.setItem('currentCount', secondsRemaining)
      } else {
        console.log('stopped')
      }
    },
    startQuiz ? 1000 : null
  )

  function useInterval(callback, delay) {
    const savedCallback = useRef()

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current()
      }
      if (delay !== null) {
        let id = setInterval(tick, delay)
        return () => clearInterval(id)
      }
    }, [delay])
  }

  useEffect(() => {
    function handleFullscreenChange() {
      if (document.fullscreenElement) {
        setStartTime(Date.now())
      } else {
        setIsFullscreenModalOpen(true)
        setEndTime(Date.now())
        setViolations([
          ...violations,
          {
            type: 'fullscreen',
            start: startTime,
            end: endTime,
            duration: endTime - startTime
          }
        ])
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [violations, startTime, endTime])

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        setEndTime(Date.now())
        setViolations([
          ...violations,
          {
            type: 'tab change',
            start: startTime,
            end: endTime,
            duration: endTime - startTime
          }
        ])
      } else {
        setStartTime(Date.now())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [violations, startTime, endTime])

  function handleOptionSelect(questionId, optionId) {
    if (quizData.Questions[currentQuestion].type === 'MCQ') {
      //if question type is MCQ
      if (selectedOptions[questionId]) {
        if (selectedOptions[questionId].includes(optionId)) {
          //if option is already selected remove it
          setSelectedOptions({
            ...selectedOptions,
            [questionId]: selectedOptions[questionId].filter(
              o => o !== optionId
            )
          })
        } else {
          //if option is not selected add it
          setSelectedOptions({
            ...selectedOptions,
            [questionId]: [...selectedOptions[questionId], optionId]
          })
        }
      } else {
        //if question is not selected add option
        setSelectedOptions({
          ...selectedOptions,
          [questionId]: [optionId]
        })
      }
    } else {
      //if question type is single
      setSelectedOptions({
        ...selectedOptions,
        [questionId]: optionId
      })
    }
  }

  const handleMarkForReview = questionId => {
    if (markedForReview[questionId]) {
      setMarkedForReview({
        ...markedForReview,
        [questionId]: false
      })
    } else {
      setMarkedForReview({
        ...markedForReview,
        [questionId]: true
      })
    }
  }

  const twoDigits = num => String(num).padStart(2, '0')

  console.log({ violations, selectedOptions, markedForReview })
  return (
    <PageLayout noStyle loading={loading}>
      <Card className="quiz-panel-pageheader" bodyStyle={{ padding: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center'
            }}
          >
            <Avatar
              size={55}
              src={
                <Image
                  preview={false}
                  src={
                    appState.profileImg
                      ? appState.profileImg
                      : 'https://joeschmoe.io/api/v1/random'
                  }
                  style={{ width: 55 }}
                />
              }
            />
            <div>
              <span>{appState.fullname}</span>
              <span
                style={{
                  display: 'block',
                  color: 'rgb(156 163 175 / 1)'
                }}
              >
                <small>Candidate ID:</small> {appState.email}
              </span>
            </div>
          </div>
          <div className="quiz-panel-countdown-container">
            <Progress
              status="active"
              type="circle"
              width={58}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068'
              }}
              percent={parseInt((100 * secondsRemaining) / INITIAL_COUNT)}
              style={{ marginTop: '3px' }}
            />
            <div style={{ padding: 0 }}>
              <small>Time Remaining</small>
              <div className="countdown-wrapper">
                <div className="time-section">
                  <div className="time">
                    {twoDigits(
                      (minutesRemaining - (minutesRemaining % 60)) / 60
                    )}
                  </div>
                  <small className="time-text">Hrs</small>
                </div>
                <div className="time-section">
                  <div className="time">:</div>
                </div>
                <div className="time-section">
                  <div className="time">
                    {twoDigits(
                      ((secondsRemaining - secondsToDisplay) / 60) % 60
                    )}
                  </div>
                  <small className="time-text">Min</small>
                </div>
                <div className="time-section">
                  <div className="time">:</div>
                </div>
                <div className="time-section">
                  <div className="time">{twoDigits(secondsRemaining % 60)}</div>
                  <small className="time-text">Sec</small>
                </div>
              </div>
            </div>
            <div className="quiz-panel-rule-button">
              <Button type="primary" onClick={() => setRulesDrawerOpen(true)}>
                Rules
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <div style={{ padding: '0.5rem' }}>
        <Row gutter={5} style={{ height: 'calc(100vh - 87px)' }}>
          <Col span={5}>
            <Card
              style={{ position: 'relative', height: '100%' }}
              bodyStyle={{ padding: 7 }}
            >
              <div className="quiz-panel-status-badges-container">
                {STATUS_BADGES.map(h => {
                  let count
                  switch (h.name) {
                    case 'Completed':
                      count = quizData?.Questions.filter(
                        q => selectedOptions[q.id]
                      ).length
                      break
                    case 'Not Answered':
                      count = quizData?.Questions.filter(
                        q => !selectedOptions[q.id]
                      ).length
                      break
                    case 'Current':
                      count = currentQuestion + 1
                      break
                  }
                  return (
                    <div key={h.name}>
                      <small>{h.name}</small>
                      <div className="quiz-panel-status-badges-item-container">
                        <div
                          style={{
                            backgroundColor: h.bgColor,
                            color: h.color
                          }}
                          className="quiz-panel-status-badge"
                        ></div>
                        <span>{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="quiz-panel-sidebar-total-questions">
                <b>
                  {quizData && quizData.Questions && quizData.Questions.length}{' '}
                  Questions
                </b>
              </p>
              <div className="quiz-panel-indextags-container">
                {quizData &&
                  quizData.Questions &&
                  quizData.Questions?.map((q, s) => (
                    <div
                      key={s}
                      className={`quiz-panel-indextags ${
                        s === currentQuestion
                          ? 'quiz-panel-indextags-current'
                          : selectedOptions[q.id]
                          ? 'quiz-panel-indextags-completed'
                          : markedForReview[q.id]
                          ? 'quiz-panel-indextags-review'
                          : ''
                      }`}
                      onClick={() => setCurrentQuestion(s)}
                    >
                      <span>{s + 1}</span>
                    </div>
                  ))}
              </div>
              {quizData?.Questions.filter(q => selectedOptions[q.id]).length >
              quizData?.Questions?.length / 2 ? (
                <Link to={`/leaderboard`}>
                  <Button
                    type="primary"
                    block
                    danger
                    className="quiz-panel-submit-btn"
                  >
                    Submit
                  </Button>
                </Link>
              ) : null}
            </Card>
          </Col>
          <Col span={19}>
            <Card
              style={{ margin: 25, position: 'relative' }}
              bodyStyle={{ position: 'relative' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontSize: '15px', letterSpacing: 3 }}>
                  <strong>
                    <b style={{ marginRight: 15 }}>Question</b>{' '}
                    {currentQuestion + 1}/{quizData?.Questions?.length}
                  </strong>
                  <Progress
                    size="small"
                    percent={
                      ((currentQuestion + 1) / quizData?.Questions?.length) *
                      100
                    }
                    showInfo={false}
                  />
                </div>
                <Button
                  onClick={() =>
                    handleMarkForReview(quizData?.Questions[currentQuestion].id)
                  }
                  type={
                    markedForReview[quizData?.Questions[currentQuestion].id]
                      ? 'default'
                      : 'link'
                  }
                >
                  <BsEye
                    style={{
                      marginRight: 7
                    }}
                  />
                  {markedForReview[quizData?.Questions[currentQuestion].id]
                    ? 'Unmark'
                    : 'Mark'}{' '}
                  for review
                </Button>
              </div>
              <div
                style={{ margin: '40px 0px', fontSize: 18, fontWeight: 500 }}
              >
                <ReactMarkdown>
                  {quizData &&
                    quizData.Questions &&
                    quizData.Questions[currentQuestion].question}
                </ReactMarkdown>
              </div>

              <Row gutter={25}>
                {quizData &&
                  quizData.Questions &&
                  quizData.Questions[currentQuestion].Choices.map((c, i) => (
                    <Col key={c?.id} span={12}>
                      <Card
                        className={`quiz-panel-option-card ${
                          selectedOptions[
                            quizData.Questions[currentQuestion].id
                          ] &&
                          selectedOptions[
                            quizData.Questions[currentQuestion].id
                          ].includes(c.id)
                            ? 'quiz-panel-option-selected'
                            : ''
                        }`}
                        onClick={() =>
                          handleOptionSelect(
                            quizData.Questions[currentQuestion].id,
                            c?.id
                          )
                        }
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 15
                          }}
                        >
                          <div
                            style={{
                              height: 35,
                              width: 35,
                              borderRadius: '50%',
                              border: '1px solid lightgray',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                          <div>
                            <ReactMarkdown className="quiz-panel-choices">
                              {c?.text}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
              </Row>

              <div style={{ width: '100%', marginTop: 30 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bottom: 10,
                    position: 'absolute',
                    width: '96%',
                    margin: '0px auto'
                  }}
                >
                  <div style={{ display: 'flex', gap: 15 }}>
                    <Button
                      onClick={() => setCurrentQuestion(currentQuestion - 1)}
                      disabled={currentQuestion === 0}
                    >
                      <AiOutlineLeft />
                    </Button>
                    <Button
                      onClick={() => setCurrentQuestion(currentQuestion + 1)}
                      disabled={
                        currentQuestion === quizData?.Questions?.length - 1
                      }
                    >
                      <AiOutlineRight />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        {/* drawer */}
        <Drawer
          placement="right"
          closable={false}
          open={rulesDrawerOpen}
          onClose={() => setRulesDrawerOpen(false)}
        >
          <div
            style={{
              paddingLeft: '16px',
              borderLeft: '2px solid #1c4980',
              marginBottom: '25px'
            }}
          >
            <h2 style={{ color: '#1c4980', fontSize: '18px' }}>
              Assessment Guidelines
            </h2>
            <p>
              Kindly read through the following key instructions and important
              guidelines for this assessment:
            </p>
          </div>
          <div style={{}}>
            <h4
              style={{
                color: '#1c4980',
                fontSize: '16px',
                borderLeft: '2px solid #1c4980',
                paddingLeft: '16px'
              }}
            >
              Assessment Guidelines
            </h4>
            <ul className="browser-default" style={{ paddingLeft: '33px' }}>
              <li className="rules-panel-list">
                <strong>Assessment Window: </strong> 16 Nov 22, 09:08 PM IST to
                22 Nov 22, 09:08 PM IST
              </li>
              <li className="rules-panel-list">
                <strong> Assessment Duration: </strong> 00:30:00 (hh:mm:ss)
              </li>
              <li className="rules-panel-list">
                <strong>Total Questions to be answered:</strong> 20 Questions
              </li>
              <li className="rules-panel-list">
                You can attempt the assessment anytime between the provided
                assessment window.
              </li>
              <li className="rules-panel-list">
                Please ensure that you attempt the assessment in one sitting as
                once you start the assessment, the timer won’t stop.
              </li>
              <li className="rules-panel-list">
                You will have to finish the assessment before 22 Nov 22, 09:08
                PM IST. To get the complete assessment duration, you need to
                start the assessment latest by 22 Nov 22, 08:38 PM IST.
                Otherwise, you’ll get less time to complete the assessment.
              </li>
            </ul>
          </div>
        </Drawer>
        {/* intial modal */}
        <Modal centered open={!startQuiz} footer={false}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 15
            }}
          >
            <Image
              src="https://media.istockphoto.com/id/1266921162/vector/tv-quiz-show-host-and-two-participants-happy-girl-winning-competition-flat-vector.jpg?s=612x612&w=0&k=20&c=2SOtslWYY3sok-fnEmYXka3ANMEXq7FHyolz4yu9Cdw="
              preview={false}
            />
            <p style={{ fontSize: 19, fontWeight: 500 }}>
              Are you ready to start the assessment?
            </p>
            <Button
              id="fullscreen"
              onClick={() => {
                localStorage.setItem('quizStarted', true)
                document.documentElement.requestFullscreen()
                setStartQuiz(true)
              }}
            >
              Start Assesment
            </Button>
          </div>
        </Modal>
        {/* warning modal */}
        <Modal centered open={isFullscreenModalOpen} footer={false}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 15
            }}
          >
            <p style={{ fontSize: 19, fontWeight: 500 }}>
              You have exited fullscreen mode. This will be recorded as a
              violation.
            </p>
            <Button
              onClick={() => {
                document.documentElement.requestFullscreen()
                setIsFullscreenModalOpen(false)
              }}
            >
              go to fullscreen
            </Button>
          </div>
        </Modal>
      </div>
    </PageLayout>
  )
}

export default QuizPanel
