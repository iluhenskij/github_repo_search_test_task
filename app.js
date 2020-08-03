let c = (l) => console.log(l)

class Search {
    constructor() {
        // cookies' names are [
        //                      searchLineCookie,
        //                      lineInFullPageCookie,
        //                      searchPageCookie
        //                                                  ]
        this.legend = document.querySelector(".results__legend");
        this.resultLines = document.querySelector(".result__lines");
        this.searchLine = document.querySelector("#search_title");
        this.searchPage = document.querySelector("#search_num");
        this.searchButton = document.querySelector("#search_button");
        this.allResLines = document.querySelectorAll(".result__lines__line");
        this.title = document.querySelector(".title")
        this.paginator = document.querySelector(".paginator")

        this.moreInfoPage = document.querySelector(".full_info_page");
        this.fullInfoPageCLoseButton = document.querySelector(".full_info_page__close_button");

        this.title = document.querySelector("h1")
        this.resultsPerPage = 10;
        this.tempArr = [];
        this.tempArrAdditionalData = []

        this.selectedPage = "";

        this.resultLines.addEventListener("click", this.showMoreInfoAboutRep.bind(this));
        this.fullInfoPageCLoseButton.addEventListener("click", this.closeFullInfo.bind(this));
        this.title.addEventListener("click",()=>{
            this.searchLine.value = "";
            this.setCookie("searchPageCookie","1")
        });
        this.title.addEventListener("click", this.searchRepositories.bind(this));

        document.addEventListener("DOMContentLoaded",this.searchRepositories.bind(this));
        this.searchButton.addEventListener("click", this.searchRepositories.bind(this));
        this.searchPage.addEventListener("click", this.searchRepositories.bind(this));
        this.paginator.addEventListener("click",this.selectPage.bind(this));

    }
    searchRepositories(event) {
        if(this.getCookie("searchLineCookie") === undefined ){
            this.searchLine.value = "";
        } else {
            this.searchLine.setAttribute("value",`${this.getCookie("searchLineCookie")}`);
        }

        this.closeFullInfo();
        let urlRequest = "";
        if (this.searchLine.value === ""){
            urlRequest = `https://api.github.com/search/repositories?q=stars:%3E100&per_page=10&sort=stars`
        }else {
            urlRequest = `https://api.github.com/search/repositories?q=${this.searchLine.value}&page=${this.searchPage.value}&per_page=10&sort=stars`
        }
        fetch(urlRequest)
            .then(res => res.json())
            .then(res => {
                new Promise(resolve =>{
                    console.log(this.tempArr = res);
                    console.log(this.tempArr.items.length);
                    outer: for (let i = 0; i < this.resultsPerPage; i++) {
                        if (i>(this.tempArr.items.length-1)){
                            this.resultLines.children[i].children[0].innerText = "";
                            this.resultLines.children[i].children[1].innerText = "";
                            this.resultLines.children[i].children[2].innerText = "";
                            this.resultLines.children[i].children[3].setAttribute("title","");
                            this.resultLines.children[i].children[3].innerText = "";
                            this.resultLines.children[i].children[4].children[0].setAttribute("href","#");
                            this.resultLines.children[i].children[4].children[0].innerText = "";
                            continue outer;

                        }
                        this.resultLines.children[i].children[0].innerText = this.searchPage.value*10-10 + (i + 1);
                        this.resultLines.children[i].children[0].setAttribute("position-in-temparr",`${[i]}`)

                        this.resultLines.children[i].children[1].innerText = this.tempArr.items[i].full_name;

                        this.resultLines.children[i].children[2].innerText = this.tempArr.items[i].stargazers_count;
                        this.resultLines.children[i].children[3].setAttribute("title",(new Date(Date.parse(`${this.tempArr.items[i].pushed_at}`))));
                        this.resultLines.children[i].children[3].innerText = this.resultLines.children[i].children[3].getAttribute(`title`).slice(0,15);

                        this.resultLines.children[i].children[4].children[0].setAttribute("href",`${this.tempArr.items[i].html_url}`);
                        this.resultLines.children[i].children[4].children[0].innerText = "GitHub Page";
                    }
                    resolve(res)
                })
        })
            .then(()=>{
            this.setCookie("searchLineCookie",this.searchLine.value,{expires: 'Wed, 14 May 2042 16:40:00 GMT'});
            this.setCookie("searchPageCookie",this.searchPage.value,{expires: 'Wed, 14 May 2042 16:40:00 GMT'});
            if (urlRequest ===`https://api.github.com/search/repositories?q=stars:%3E100&per_page=10&sort=stars`) return;
            this.createPaginator();
            this.showMoreInfoAboutRep()
         })
    }

    showMoreInfoAboutRep(event){
        let pos;
        if (event){
            if(event.target.classList[1] !== "results__lines__line__item") return //проверяю куда был клик
            pos = (+event.target.parentElement.children[0].getAttribute("position-in-temparr"));
            this.setCookie("lineInFullPageCookie",pos, {expires: 'Wed, 14 May 2042 16:40:00 GMT'})
        } else {
            this.getCookie("lineInFullPageCookie") == undefined? pos = -1: pos = +this.getCookie("lineInFullPageCookie")
        }

        if (pos<0) return
        let urlsForGetAdditionalInfo = [this.tempArr.items[pos].contributors_url,this.tempArr.items[pos].languages_url,this.tempArr.items[pos].owner.url];

        fetch(urlsForGetAdditionalInfo[0])
            .then(res => res.json())
            .then(res => console.log(this.tempArrAdditionalData[0] = res))
            .then(()=>{
                fetch(urlsForGetAdditionalInfo[1])
                    .then(res=> res.json())
                    .then(res => console.log(this.tempArrAdditionalData[1] = res))
                    })
                .then(()=> fetch(urlsForGetAdditionalInfo[2]))
                    .then((res)=>res.json())
                    .then(res =>console.log(this.tempArrAdditionalData[2] = res))
                .then(()=>{
                    this.openFullInfoTab()

                    this.moreInfoPage.children[0].children[0].innerText = this.tempArr.items[pos].name;

                    this.moreInfoPage.children[0].children[1].innerText = this.tempArr.items[pos].stargazers_count;
                    this.moreInfoPage.children[1].setAttribute("title",(new Date(Date.parse(`${this.tempArr.items[pos].pushed_at}`))));
                    this.moreInfoPage.children[1].innerText = this.resultLines.children[pos].children[3].getAttribute(`title`).slice(0,15);

                    this.moreInfoPage.children[4].innerText = this.tempArr.items[pos].language;
                    this.moreInfoPage.children[5].innerText = this.tempArr.items[pos].description;
                    document.querySelector(".full_info_page__owner__name").children[0].innerText = this.tempArr.items[pos].owner.login;
                    document.querySelector(".full_info_page__owner__name").children[1].innerText = this.tempArrAdditionalData[2].name
                    document.querySelector(".full_info_page__owner__photo").setAttribute("src",`${this.tempArr.items[pos].owner.avatar_url}`)
                    for (let i = 0;i<10;i++){
                        let list = document.querySelector("ul").children;
                        list[i].innerText = this.tempArrAdditionalData[0][i].login;
                    }

    })
    }
        openFullInfoTab(){
         for (let i = 0; i < this.allResLines.length; i++) {
             this.allResLines[i].style.display = "none"
         }
         this.legend.style.display = "none"
         this.moreInfoPage.style.display = "grid";
         this.paginator.style.display = "none";
    }
        closeFullInfo(){
        for (let i = 0; i < this.allResLines.length; i++) {
            this.allResLines[i].style.display = "grid"
        }
        this.moreInfoPage.style.display = "none";
        this.legend.style.display = "grid";
        this.deleteCookie("lineInFullPageCookie");
        this.paginator.style.display = "inline-grid";

    }

    createPaginator(){
        this.paginator.innerHTML = ""
        if(this.getCookie("searchPageCookie") === undefined ){
            this.searchPage.value = "1";
            console.log("Cookie is undefined")
        } else {
            this.searchPage.setAttribute("value",`${this.getCookie("searchPageCookie")}`);
            console.log("Cookie is defined")
        }

        let elementToDisplay = this.tempArr.total_count;
        let countOfPages = Math.ceil(elementToDisplay/10);

        if (elementToDisplay<10) return
        else{
            this.paginator.append(this.createElem("div","paginator__page","1"));

            countOfPages > 2?this.paginator.append(this.createElem("div","paginator__page","2")):{};
            countOfPages > 3?this.paginator.append(this.createElem("div","paginator__page","3")):{};
            countOfPages > 4?this.paginator.append(this.createElem("div","paginator__page","4")):{};
            countOfPages > 5?this.paginator.append(this.createElem("div","paginator__page","5")):{};

            countOfPages > 6?this.paginator.append(this.createElem("div","paginator__points","...")):{};

            countOfPages < 99 && countOfPages > 7?this.paginator.append(this.createElem("div","paginator__page",`${countOfPages}`)):{};
            countOfPages > 99?this.paginator.append(this.createElem("div","paginator__page",`100`)):{};
        }

    }
    createElem(tag,styleClass,innerTxt){
        let elem = document.createElement(`${tag}`);
        elem.classList.add(styleClass);
        elem.innerText = innerTxt;
        return elem
    }
    selectPage(event){
        if (event.target.classList[0] !== "paginator__page") return
        console.log(event.target.classList)
        if(this.selectedPage){
            this.selectedPage.classList.remove("paginator__page_selected")
        }
        this.selectedPage = event.target;
        this.selectedPage.classList.add("paginator__page_selected")

        this.searchPage.setAttribute("value",`${this.selectedPage.innerText}`);
        this.searchRepositories()
    }

    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    setCookie(name, value, options = {}) {
        options = {
            path: '/',
            ...options
        };

        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }

        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    }
    deleteCookie(name) {
        this.setCookie(name, "", {
            'max-age': -1
        })
    }
}

let exm = new Search()


