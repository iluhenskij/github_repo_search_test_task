let c = (l) => console.log(l)

class Search {
    constructor() {
        this.legend = document.querySelector(".results__legend");
        this.resultLines = document.querySelector(".result__lines");
        this.searchLine = document.querySelector("#search_title");
        this.searchPage = document.querySelector("#search_num");
        this.searchButton = document.querySelector("#search_button");
        this.allResLines = document.querySelectorAll(".result__lines__line");
        this.title = document.querySelector(".title")

        this.moreInfoPage = document.querySelector(".full_info_page");
        this.fullInfoPageCLoseButton = document.querySelector(".full_info_page__close_button");

        this.title = document.querySelector("h1")
        this.resultsPerPage = 10;
        this.tempArr = [];
        this.tempArrAdditionalData = []

        this.resultLines.addEventListener("click", this.showMoreInfoAboutRep.bind(this));
        this.fullInfoPageCLoseButton.addEventListener("click", this.closeFullInfo.bind(this));
        this.title.addEventListener("click", this.closeFullInfo.bind(this));
        this.title.addEventListener("click", ()=>{ this.searchLine.value = ""});
        this.title.addEventListener("click", this.searchRepositories.bind(this));

        //this.data = async function d(){
        //    let firstDate = new Date();
        //    let url = 'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits';
        //    let response = await fetch(url);
        //    let secondDate = new Date();
        //    let commits = await response.json(); // читаем ответ в формате JSON
        //    alert(commits[0].author.login);
        //};
        /*        this.request = this.searchLine.addEventListener("keyup",()=>{
                this.data()
                for(let i = 1;i<this.resultLines.children.length;i++){
                    this.resultLines.children[i].children[this.searchLineNum.value].innerHTML = `${this.searchLine.value}`
                }
        })*/
        this.startPage = document.addEventListener("DOMContentLoaded",this.searchRepositories.bind(this));
        this.searchButton.addEventListener("click", this.searchRepositories.bind(this));
        this.searchPage.addEventListener("click", this.searchRepositories.bind(this));
    }
    async searchRepositories(event) {
        this.closeFullInfo()
        let urlRequest = "";
        if (this.searchLine.value === ""){
            urlRequest = `https://api.github.com/search/repositories?q=stars:%3E100&per_page=10&sort=stars`
        }else {
            urlRequest = `https://api.github.com/search/repositories?q=${this.searchLine.value}&page=${this.searchPage.value}&per_page=10&sort=stars`
        }
         return await fetch(urlRequest).then((res) => {
            if (res.ok) {
                res.json().then(res => {
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
                        this.resultLines.children[i].children[1].innerText = this.tempArr.items[i].full_name;

                        this.resultLines.children[i].children[2].innerText = this.tempArr.items[i].stargazers_count;
                        this.resultLines.children[i].children[3].setAttribute("title",(new Date(Date.parse(`${this.tempArr.items[i].pushed_at}`))));
                        this.resultLines.children[i].children[3].innerText = this.resultLines.children[i].children[3].getAttribute(`title`).slice(0,15);

                        this.resultLines.children[i].children[4].children[0].setAttribute("href",`${this.tempArr.items[i].html_url}`);
                        this.resultLines.children[i].children[4].children[0].innerText = "GitHub Page";

                        //this.resultLines.children[i].children[6].innerText = this.tempArr.items[i].language;
                        //this.resultLines.children[i].children[7].innerText = this.tempArr.items[i].description;
                    }
                })
            }
        })
    }
    async showMoreInfoAboutRep(event){
        if(event.target.classList[1] !== "results__lines__line__item") return //проверяю куда был клик
        c(event.target.classList[1]);
        targ = event.target.parentElement.children[0];
        let pos = (+targ.textContent -1);
        let urlsForGetAdditionalInfo = [this.tempArr.items[pos].contributors_url,this.tempArr.items[pos].languages_url,this.tempArr.items[pos].owner.url];

        await fetch(urlsForGetAdditionalInfo[0]).then((res) => {
                res.json().then(res => {
                        console.log(this.tempArrAdditionalData[0] = res);

                    }
                )
                .then(()=>{
                        fetch(urlsForGetAdditionalInfo[1]).then((res)=>{
                            res.json().then(res => {
                                console.log(this.tempArrAdditionalData[1] = res);
                            })
                        })
                    })
                .then(()=>{
                    fetch(urlsForGetAdditionalInfo[2]).then((res)=>{
                        res.json().then(res => {
                            console.log(this.tempArrAdditionalData[2] = res);
                        })
                    })
                }).then(()=>{
                    for (let i = 0; i < this.allResLines.length; i++) {
                        this.allResLines[i].style.display = "none"
                    }
                    this.legend.style.display = "none"
                    this.moreInfoPage.style.display = "grid";


                    this.moreInfoPage.children[0].children[0].innerText = this.tempArr.items[pos].name;

                    this.moreInfoPage.children[0].children[1].innerText = this.tempArr.items[pos].stargazers_count;
                    this.moreInfoPage.children[1].setAttribute("title",(new Date(Date.parse(`${this.tempArr.items[pos].pushed_at}`))));
                    this.moreInfoPage.children[1].innerText = this.resultLines.children[pos].children[3].getAttribute(`title`).slice(0,15);
                    for (let i = 0;i<10;i++){
                        let list = document.querySelector("ul").children;
                        list[i].innerText = this.tempArrAdditionalData[0][i].login;
                    }
                    this.moreInfoPage.children[4].innerText = this.tempArr.items[pos].language;
                    this.moreInfoPage.children[5].innerText = this.tempArr.items[pos].description;
                    document.querySelector(".full_info_page__owner__name").children[0].innerText = this.tempArr.items[pos].owner.login;
                    document.querySelector(".full_info_page__owner__name").children[1].innerText =  this.tempArrAdditionalData[2].name
                    document.querySelector(".full_info_page__owner__photo").setAttribute("src",`${this.tempArr.items[pos].owner.avatar_url}`)

                })
        })
    }
    closeFullInfo(){
        for (let i = 0; i < this.allResLines.length; i++) {
            this.allResLines[i].style.display = "grid"
        }
        this.moreInfoPage.style.display = "none";
        this.legend.style.display = "grid"
    }
}

let exm = new Search()
let targ;


