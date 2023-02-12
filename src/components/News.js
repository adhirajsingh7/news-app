import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";




const News = (props) => {

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const updateNews = async () => {
    props.setProgress(10)
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`
    setLoading(true)
    let data = await fetch(url)
    props.setProgress(30)
    let parsedData = await data.json()
    props.setProgress(70)
    // console.log(parsedData)
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100)
  }

  // useEffect is same as componentDidMount
  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`
    updateNews()
    // eslint-disable-next-line
  }, [])
  // above comment line disables warning ↑

  //-----------------------------------------------------------
  /* how to find total number of pages ->
  (total pages)/(how many articles in single page) */
  //-------------------------------------------------------------------------------
  /* componentDidMount is a lifecycle..it will run after render method.(Note -> constructor will run before render)
  let url is used for storing the news url
  then we will use fetch api wich takes url as input and returns promise
  we are using async as we will wait for fetch(url) to resolve
  let parseData will convert returned promise into json
  setState() will populate the news on website
*/

  //--------prev   next buttons----------
  // const handlePrevclick = async () => {
  //   setPage(page-1)
  //   updateNews()
  // }
  // const handleNextclick = async () => {
  //   setPage(page+1)
  //   updateNews()
  // }
  //-------------------------------------

  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
    setPage(page + 1)
    let data = await fetch(url)
    let parsedData = await data.json()
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  };


  // {loading && <Spinner/>}  it means display spinner if this is true

  // (!loading &&) add this with articles.map((element)=> ... so that data is not displayed when loading 

  return (
    <>
      <h1 className='text-center' style={{ margin: '35px 0px', marginTop: '90px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container my-3">
          <div className="row">

            {articles.map((element) => { /* !loading ->
                                          it means it will show news only if loading is false */
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title : ""}
                  description={element.description ? element.description : ""} imageUrl={element.urlToImage}
                  newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>

            })}
          </div>

        </div>
      </InfiniteScroll>
      {/* <div className="container d-flex justify-content-between">
        <button disabled={page<=1} type="button" className="btn btn-dark" onClick={handlePrevclick}>&larr; Previous</button>
        <button disabled={page + 1 > (Math.ceil(state.totalResults/props.pageSize))} type="button" className="btn btn-dark" onClick={handleNextclick}>Next &rarr;</button>
        </div> */}
    </>
  )
}
News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general'


}
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}

export default News