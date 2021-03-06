import React, { Component } from 'react'
import { Route, Switch, Link } from 'react-router-dom'

import { connect } from 'react-redux'

import Notice from './Notice/Notice'
import Selection from './Selection/Selection'
import Post from './Post/Post'
import Detail from './Detail/Detail'

import Back from '../../../Library/Icons/Back'
import * as lib from '../../../Library/Library'

import './Manager.css'

function mapStateToProps(state) {
  return {
    pc: state.status.pc
  }
}

function mapDispatchToProps() {
  return {}
}

class Manager extends Component {
  render () {
    const { pc } = this.props

    return (
      <div className={'manager' + lib.pcClass(pc)}>

        <Switch>
          <Route exact path='/manager' component={Notice} />
          <Route exact path='/manager/selection' component={Selection} />
          <Route exact path='/manager/selection/add' component={Post} />
          <Route exact path='/manager/selection/edit/:id' component={Post} />
          <Route exact path='/manager/selection/detail/:id' component={Detail} />
        </Switch>

        <div className={'box back-to-home' + lib.pcClass(pc)}>
          <div className='back-link'>
            <ul>
              <li><Link to='/'><div className='inner'><Back /><span>ホーム</span></div></Link></li>
            </ul>
          </div>
        </div>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Manager)
