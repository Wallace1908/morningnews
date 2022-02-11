import React, {useState, useEffect} from 'react';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav'

import {connect} from 'react-redux'

const { Meta } = Card;

function ScreenMyArticles(props) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  
  const [wishlist, setWishlist] = useState([])
  console.log("---wishlist", wishlist)

  useEffect(() => {
    console.log("---useEffect d'actualisation");
    async function loadMyArticles(){
      console.log("---function loadMyArticles")
  
      var rawResponse = await fetch(`/myarticles?userToken=${props.userToken}`);
      var res = await rawResponse.json();
      console.log("---res=>", res);
      setWishlist(res.wishlist)
      
    }
    loadMyArticles()

  }, []);



  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)

  }

  var handleOk = e => {
    console.log(e)
    setVisible(false)
  }

  var handleCancel = e => {
    console.log(e)
    setVisible(false)
  }

  var deleteWishList = async (title) => {
    console.log("---deleteWishList, article", title)

    const data = await fetch('/deletewishlist', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `titleFromFront=${title}&userToken=${props.userToken}`
    })

    const body = await data.json()
    console.log("---body", body)

    setWishlist(wishlist.filter((article)=>{
      return article.title != title
    }))
  }

  var noArticles
  if(wishlist.length == 0){
    noArticles = <div style={{marginTop:"30px"}}>No Articles</div>
  }

  return (
    <div>
         
            <Nav/>

            <div className="Banner"/>

            {noArticles}

            <div className="Card">
    

            {wishlist.map((article,i) => (
                <div key={i} style={{display:'flex',justifyContent:'center'}}>

                  <Card
                    
                    style={{ 
                    width: 300, 
                    margin:'15px', 
                    display:'flex',
                    flexDirection: 'column',
                    justifyContent:'space-between' }}
                    cover={
                    <img
                        alt="example"
                        src={article.urlToImage}
                    />
                    }
                    actions={[
                        <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title,article.content)} />,
                        <Icon type="delete" key="ellipsis" onClick={() => deleteWishList(article.title)} />
                    ]}
                    >

                    <Meta
                      title={article.title}
                      description={article.content}
                    />

                  </Card>
                  <Modal
                    title={title}
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <p>{content}</p>
                  </Modal>

                </div>

              ))}



       

                

             </div>
      
 

      </div>
  );
}

function mapStateToProps(state){
  return {userToken: state.token}
}

// function mapDispatchToProps(dispatch){
//   return {
//     deleteToWishList: function(articleTitle){
//       dispatch({type: 'deleteArticle',
//         title: articleTitle
//       })
//     }
//   }
// }



export default connect(
  mapStateToProps,
  null
  // mapDispatchToProps
)(ScreenMyArticles);
