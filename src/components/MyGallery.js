import React, { Component } from "react";
import Grid from "./Grid";
import Pagination from "./Pagination";
import Search from "./Search";
import Sort from "./Sort";
import ItemPerPage from "./ItemPerPage";
import {
  compareValues,
  formatFeedToArray,
  calculateNewGrid
} from "./JSfucntions";
import PopupView from "./PopupView";
import "./style.css";

class MyGallery extends Component {
  state = {
    feed: this.props.feed,
    isLoaded: false,
    imgList: [],
    resultsPerPage: parseInt(this.props.resultsPerPage) || 10,
    pageOnShow: 1,
    listForGrid: [],
    searchInput: "",
    filteredList: [],
    sortBy: "title",
    blackList: [],
    unavailabeImages: [],
    isToShowPopup: false,
    imgOnPopUP: {},
    errorInFetch: false,
    autoRotateTime: parseInt(this.props.autoRotateTime) * 1000 || 4000
  };

  componentDidMount() {
    fetch(this.state.feed)
      .catch(() => {
        //Error in fetching
        this.setState({
          errorInFetch: true
        });
      })
      .then(res => res.json())
      .then(result => {
        //Compare the blackList (stored in localStorge) with the given feed list and filter it
        let Filterdlist = formatFeedToArray(result);
        const blackList = JSON.parse(localStorage.getItem("blackList")) || [];
        if (blackList) {
          blackList.map(blackID => {
            return (Filterdlist = Filterdlist.filter(
              img => img.id !== parseInt(blackID)
            ));
          });
        }

        //Setting state for the first time
        this.setState({
          isLoaded: true,
          imgList: Filterdlist,
          filteredList: Filterdlist.sort(
            compareValues(this.state.sortBy, "asc")
          ),
          blackList: blackList,
          imgOnPopUP: Filterdlist[0] //Load the first img for the SlideShow
        });

        this.updateGrid(1); //Update the grid for page #1
      });
  }

  updateGrid = pageToChange => {
    //Update the gallery grid based on page

    //Calculate the new grid base on page, results per page, and filter list
    const newListForGrid = calculateNewGrid(
      pageToChange,
      this.state.resultsPerPage,
      [...this.state.filteredList]
    );

    this.setState({
      listForGrid: newListForGrid,
      pageOnShow: pageToChange
    });
  };

  handleChangeSearch = event => {
    //Filter the array by search input
    //update the grid and change to the first page
    const imgList = [...this.state.imgList];
    let newfilteredList = imgList.filter(img =>
      img.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    this.setState(
      {
        searchInput: event.target.value,
        filteredList: newfilteredList
      },
      () => {
        this.updateGrid(1);
      }
    );
  };

  handleChangeSort = event => {
    //Sort the the filteredList by by selector value (can be change on Sort component)
    //update the grid and change to the first page
    const NewImgList = [...this.state.filteredList];
    NewImgList.sort(compareValues(event.target.value, "asc"));
    this.setState(
      {
        sortBy: event.target.value,
        filteredList: NewImgList
      },
      () => {
        this.updateGrid(1);
      }
    );
  };

  handleChangeItemPerPage = event => {
    //change the resultPerPage value and updage the grid
    this.setState(
      {
        resultsPerPage: event.target.value
      },
      () => {
        this.updateGrid(1);
      }
    );
  };

  handleDeleteImage = imgId => {
    //Filter both FilterList array and ImgList arrat.
    //Img List is constant array, FliterList always change depends on search
    //Adding an element in the blackList and store it again on localStorge
    const newImgList = this.state.imgList.filter(img => img.id !== imgId);
    const newFilterdlist = this.state.filteredList.filter(
      img => img.id !== imgId
    );

    this.setState(
      {
        imgList: newImgList,
        filteredList: newFilterdlist,
        blackList: [...this.state.blackList, imgId]
      },
      () => {
        // This is to prevent a situation that deleting the last img on grid
        // It checks the new grid that suppose to come after deleting
        // if the grid is empty it calls previos page
        const newListForGrid = calculateNewGrid(
          this.state.pageOnShow,
          this.state.resultsPerPage,
          [...this.state.filteredList]
        );
        localStorage.setItem("blackList", JSON.stringify(this.state.blackList));
        newListForGrid.length > 0
          ? this.updateGrid(this.state.pageOnShow)
          : this.updateGrid(this.state.pageOnShow - 1);
      }
    );
  };

  handleImageError = imgId => {
    //This function called fom <img> elemnt in case it unavalible image
    //It will add it to unavalible imgs array (if it doesnt exist) and store on state
    if (!this.state.unavailabeImages.find(element => element === imgId)) {
      this.setState({
        unavailabeImages: [...this.state.unavailabeImages, imgId]
      });
    }
  };

  handlePopUpChange = (imgData, changeTo) => {
    //Handle changes on popup and pop it on
    //recive imgData to show and an action: "next","previous",null
    let imgToshow;
    const elemntInArray = this.state.filteredList.findIndex(element => {
      return element.id === imgData.id;
    });
    if (changeTo === "next") {
      imgToshow = this.state.filteredList[elemntInArray + 1];
    } else if (changeTo === "previous") {
      imgToshow = this.state.filteredList[elemntInArray - 1];
    } else {
      imgToshow = imgData;
    }

    this.setState({
      isToShowPopup: true,
      imgOnPopUP: imgToshow || imgData
    });
  };
  handlePopUpClose = () => {
    //Close to popUp and clear the time interval
    clearInterval(this.timeIntrval);
    this.setState({
      isToShowPopup: false
    });
  };

  Slideshow = () => {
    //turn SlideShow on by popup the first img

    this.handlePopUpChange(this.state.filteredList[0]);
    this.timeIntrval = setInterval(
      () => this.handlePopUpChange(this.state.imgOnPopUP, "next"),
      this.state.autoRotateTime
    );
  };

  //Main Appliction
  main = () => {
    return (
      <div>
        {this.props.search !== "false" && (
          <Search
            searchInput={this.state.searchInput}
            handleChangeSearch={this.handleChangeSearch}
          />
        )}
        {this.props.sorting !== "false" && (
          <Sort
            onChangeSort={this.handleChangeSort}
            sortBy={this.state.sortBy}
          />
        )}
        <ItemPerPage
          onChangeItemPerPage={this.handleChangeItemPerPage}
          ItemPerPage={this.state.resultsPerPage}
        />
        <Grid
          imagesList={this.state.listForGrid}
          imagesListLength={this.state.listForGrid.length}
          onDeleteImg={this.handleDeleteImage}
          onImgError={this.handleImageError}
          onImgClick={this.handlePopUpChange}
        />
        {this.props.pagination !== "false" && (
          <Pagination
            resultsOnPage={this.state.resultsPerPage}
            lenghtOflist={this.state.filteredList.length}
            pageOnShow={this.state.pageOnShow}
            onChangePage={this.updateGrid}
          />
        )}
        {this.state.isToShowPopup && (
          <PopupView
            onPopClose={this.handlePopUpClose}
            onPopChange={this.handlePopUpChange}
            imgData={this.state.imgOnPopUP}
          />
        )}
        <div />
        <button onClick={() => this.Slideshow()}>Start SlideShow</button>
      </div>
    );
  };

  errorMessage = () => {
    return (
      <div>
        <h1>Error: there are 2 or more images unavailabe</h1>
      </div>
    );
  };

  loadingDiv = () => {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  };

  render() {
    return (
      <div>
        {!this.state.isLoaded
          ? this.loadingDiv()
          : !this.state.errorInFetch && this.state.unavailabeImages.length < 2
          ? this.main()
          : this.errorMessage()}
      </div>
    );
  }
}

export default MyGallery;
