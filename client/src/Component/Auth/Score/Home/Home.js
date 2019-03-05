import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'

import { setBackNavigation } from '../../../../Actions/Navigation'
import { getScoreListAll, getScoreList, loadMore, resetShowList, changeSearchText, resetSearchQuery, setSearchBoxRef, setDisplayScoreModal } from '../../../../Actions/Score'

import * as libScore from '../Library/Library'

import './Home.css'

function mapStateToProps(state) {
  return {
    pc: state.status.pc,
    loadingScore: state.score.loading,
    scoreList: state.score.scoreList,
    showList: state.score.showList,
    loadMoreLoading: state.score.loadMoreLoading,
    searchQuery: state.score.searchQuery,
    searchLoading: state.score.searchLoading,
    searchBoxRef: state.score.searchBoxRef
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setBackNavigation (backNavigation, backNavigationPath) {
      dispatch(setBackNavigation(backNavigation, backNavigationPath))
    },
    getScoreListAll () {
      dispatch(getScoreListAll())
    },
    getScoreList (query) {
      dispatch(getScoreList(query))
    },
    loadMore () {
      dispatch(loadMore())
    },
    resetShowList () {
      dispatch(resetShowList())
    },
    changeSearchText (query) {
      dispatch(changeSearchText(query))
    },
    resetSearchQuery () {
      dispatch(resetSearchQuery())
    },
    setSearchBoxRef (searchBoxRef) {
      dispatch(setSearchBoxRef(searchBoxRef))
    },
    setDisplayScoreModal (displayScoreModal, modalContent) {
      dispatch(setDisplayScoreModal(displayScoreModal, modalContent))
    }
  }
}

class Home extends Component {
  componentDidMount () {
    this.props.setBackNavigation(true, '/')
    this.props.searchQuery ? this.props.changeSearchText(this.props.searchQuery) : this.props.getScoreListAll()
  }

  componentWillUnmount () {
    this.props.resetShowList()
  }


  renderScoreList () {
    if (this.props.loadingScore || !this.props.scoreList) return <div className="loading"><div className="loading1"></div><div className="loading2"></div><div className="loading3"></div></div> 
    return this.props.showList.map((each, i) => {
      if (!each.status) return
      const composer = each.composer.length === 0 ? '' : libScore.makeLine(each.composer)
      const arranger = each.arranger.length === 0 ? '' : libScore.makeLine(each.arranger)
      const bar = composer === '' || arranger === '' ? '' : <span className='bar'>/</span>
      // const boxInfo = this.state.boxMode ? <div className='locate'><span className='box-label'>{each.boxLabel}</span>&ndash;<span className='score-number'>{each.label}</span></div> : ''
        // <div key={each._id} className='score-list' onTouchStart={() => {}} onClick={(e) => {this.openDetail(e, each)}}>
      return (
        <div key={each._id} className='score-list' onTouchStart={() => {}} onClick={() => {this.props.setDisplayScoreModal(true, each)}}>
          <div className='content'>
            {/* {boxInfo} */}
            <div className='title-ja'><span>{each.titleJa}</span></div>
            <div className='title-en'><span>{each.titleEn}</span></div>
            <div className='composer-arranger'><span><span>{composer}</span>{bar}<span>{arranger}</span></span></div>
          </div>
        </div>
      )
    })
  }

  renderLoadMore () {
    if (this.props.loadingScore || !this.props.scoreList) return
    if (this.props.loadMoreLoading) return
    if (this.props.scoreList.length > 10 && this.props.scoreList.length !== this.props.showList.length) {
      return <div onClick={() => this.props.loadMore()} className='score-more'><span>すべての楽譜を表示</span></div>
    }
  }

  keyPress (e) {
    if (e.which === 13) this.props.getScoreList(this.props.searchQuery)
  }

  renderSearch () {
    const searchIcon = this.props.searchLoading ? <i className='fas fa-spinner fa-pulse'></i> : <i className='fas fa-search'></i>
    const searchBarButtonClass = this.props.searchQuery ? 'search-bar-button' : 'search-bar-button hidden'
    console.warn(this.props.searchQuery, searchBarButtonClass)
    return (
      <div className='search-bar'>
        <div className='search-frame'>
          <div className='search-box'>
            <div className='search-bar-icon'>{searchIcon}</div>
            <input type='text' value={this.props.searchQuery} onChange={(e) => this.props.changeSearchText(e.target.value)} onKeyPress={(e) => this.keyPress(e)}  ref={(i) => {!this.props.searchBoxRef ? this.props.setSearchBoxRef(i) : false}} placeholder='検索' />
            <div onClick={() => this.props.resetSearchQuery()} className={searchBarButtonClass}><i className='fas fa-times-circle'></i></div>
          </div>
        </div>
      </div>
    )
  }

  renderCount () {
    if (this.props.loadingScore || !this.props.scoreList) return false
    return (
      <div className='score-count'>
        <div>
          {this.props.scoreList ? <span>楽譜</span> : false}
          {this.props.scoreList ? <span>{this.props.scoreList.length}</span> : false}
          {this.props.scoreList ? <span>件</span> : false}
        </div>
      </div>
    )
  }

  render () {

    const showSearch = this.renderSearch()
    const showCount = this.renderCount()
    const showScoreList = this.renderScoreList()
    const showLoadMore = this.renderLoadMore()

    const endLabel = this.props.scoreList ? !(this.props.scoreList.length > 10 && this.props.scoreList.length !== this.props.showList.length) ? <div className='end-label'>{!this.props.loading && !this.props.searchLoading ? this.props.scoreList.length === 0 ? 'みつかりませんでした' : 'これ以上データはありません' : false}</div> : false : false

    return (
      <React.Fragment>
        <div className='contents-header'>
          <div className='bread-navigation'><Link to='/'>ホーム</Link><i className="fas fa-chevron-right"></i><Link to='/score'>ウィンズスコア</Link></div>
          <h2>ウィンズスコア</h2>
          <p>ウィンズが所有している楽譜です</p>
        </div>
        <div className='box score-home'>
          {showSearch}
          {showCount}
          {showScoreList}
          {showLoadMore}
          {endLabel}
        </div>
        <div className='box back-to-home'>
          <div className='back-link'>
            <ul>
              <li><Link to='/'><div className='inner'><i className="fas fa-angle-left"></i><span>ホーム</span></div></Link></li>
            </ul>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
