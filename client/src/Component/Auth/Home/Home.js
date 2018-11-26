import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { connectSocket } from '../../../Actions/Socket'

import { getSchedule } from '../../../Actions/Schedule'
import { getManager } from '../../../Actions/Manager'

import { showToast } from '../../../Actions/Toast'

import './Home.css'

function mapStateToProps(state) {
  return {
    socketid: state.socket.id,
    mobile: state.status.mobile,

    loadingSchedule: state.schedule.loading,
    schedule: state.schedule.data,
    loadingManager: state.manager.loading,
    manager: state.manager.data
  }
}

function mapDispatchToProps(dispatch) {
  return {
    connectSocket () {
      dispatch(connectSocket())
    },
    getSchedule () {
      dispatch(getSchedule())
    },
    getManager () {
      dispatch(getManager())
    },

    showToast (string) {
      dispatch(showToast(string))
    }
  }
}

class Home extends Component {
  componentDidMount () {
    this.props.connectSocket()

    this.props.getSchedule()
    this.props.getManager()
  }

  renderSchedule (loading, schedule) {
    if (loading || !schedule) return <div className="loading"><div className="loading1"></div><div className="loading2"></div><div className="loading3"></div></div>
    const today = schedule.today ? <span className='today'>本日</span> : ''
    const next = schedule.next
    const date = next.date.split('-')
    const month = date[1].match(/0[0-9]/) ? date[1].replace(/^0/g, '') : date[1]
    const day = date[2].match(/0[0-9]/) ? date[2].replace(/^0/g, '') : date[2]
    const memo = next.memo ? <span className='memo'>{next.memo}</span> : ''
    const studio = next.studio.match(/第[1-9]スタジオ/) ? <span>第<span>{next.studio.replace('第', '').replace('スタジオ', '')}</span>スタジオ</span> : <span>{next.studio}</span>
    return (
      <div className='next'>
        <div className='next-labels'>
          {today}
          {memo}
          {/* <span className='memo'>今井合奏</span> */}
        </div>
        <div className='next-day'>
          {/* <span className='year'>{date[0]}<span>年</span></span> */}
          <span className='month'>{month}<span>月</span></span>
          <span className='day'>{day}<span>日</span></span>
          <span className={'date ' + next.weeken}>{next.weekjp}</span>
        </div>
        <div className='next-time'>
          <span className='time'>{next.time.start}</span><span className='while'>～</span><span className='time'>{next.time.end}</span>
        </div>
        <div className='next-place'>
          <span className='place'>{next.place}</span>
          <span className='studio'>{studio}</span>
        </div>
      </div>
    )
  }

  renderManager (loading, manager) {
    if (loading || !manager) return <div className="loading"><div className="loading1"></div><div className="loading2"></div><div className="loading3"></div></div>
    return (
      <div className='top-notice'>
        <div className='top-notice-title'>{manager.manager[0].title}</div>
        <div className='top-notice-text' dangerouslySetInnerHTML={{__html: manager.manager[0].text}}></div>
      </div>
    )
  }

  render () {
    // State List
    const { socketid, mobile, loadingSchedule, schedule, loadingManager, manager } = this.props
    // Dispatch List
    // const { logout } = this.props
    const socketStatus = socketid ? 'OK' : 'NG'
    const mobileMode = mobile ? ' mobile' : ''

    const showScheduleNext = this.renderSchedule(loadingSchedule, schedule)
    const showManager = this.renderManager(loadingManager, manager)
    return (
      <div className={'home' + mobileMode}>
        <div className='contents-header'>
          <h2>団員専用ページ {socketStatus}</h2>
        </div>
        <div className='box home-schedule'>
          <div className='title-frame'>
            <label>次回の練習日</label>
            <div className='text'>
              {showScheduleNext}
            </div>
          </div>
          <div className='link'>
            <ul>
              <li><Link to='/schedule'><div className='inner'><span>More</span><i className="fas fa-angle-right"></i></div></Link></li>
            </ul>
          </div>
        </div>

        <div className='box home-manager'>
          <div className='title-frame'>
            <label>お知らせ</label>
            <div className='text'>
              {showManager}
            </div>
          </div>
          <div className='link'>
            <ul>
              <li><Link to='/manager'><div className='inner'><span>More</span><i className="fas fa-angle-right"></i></div></Link></li>
            </ul>
          </div>
        </div>



        {/* <button onClick={() => this.props.showToast('Toast!!!')}>Toast</button> */}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
