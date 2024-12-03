{
    'use strict';

    // document.getElementById('test-button').addEventListener('click', function () {
    //     const links = document.querySelectorAll('.titles a');
    //     console.log('links:', links);
    // })

    const titleClickHandler = function (event) {
        event.preventDefault();
        const clickedElement = this;
        console.log('Link was clicked');

        /* [DONE] remove class 'active' from all article links*/
        const activeLinks = document.querySelectorAll('.titles a.active');

        for (let activeLink of activeLinks) {
            activeLink.classList.remove('active');
        }

        /* [DONE] add class 'active' to the clicked link */
        clickedElement.classList.add('active');
        console.log('clickedElement: ', clickedElement);

        /* [DONE] remove class 'active' from all articles */
        const activeArticles = document.querySelectorAll('.posts article.active');

        for (let activeArticle of activeArticles) {
            activeArticle.classList.remove('active');
        }

        /* [DONE] get 'href' attribute from the clicked link */
        const activeAttribute = clickedElement.getAttribute('href');
        console.log('clicked element active attribute: ', activeAttribute)

        /* [DONE] find the correct article using the selector (value of 'href' attribute) */
        const clickedArticle = document.querySelector(activeAttribute);
        console.log('cliked article: ', clickedArticle)

        /* [DONE] add class 'active' to the correct article */
        clickedArticle.classList.add('active');

    }

    const optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles';

    const generateTitleLinks = function () {
        console.log('generateTitleLinks function: ', generateTitleLinks);

        /* [DONE] remove contents of titleList*/
        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';

        /* [DONE] find all the articles and save them to variable: articles*/
        const articles = document.querySelectorAll(optArticleSelector);

        let html = '';

        for (let article of articles) {
            /* [DONE] get the article id*/
            const articleId = article.getAttribute('id');
            console.log('id attribute: ', articleId);

            /* [DONE] find the title element*/
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;
            console.log('articleTitle: ', articleTitle);

            /* get the title from the title element*/

            /* [DONE] create HTML of the link*/
            const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
            console.log('linkHTML: ', linkHTML);

            /* [DONE] insert link into titleList*/
            // titleList.innerHTML = titleList.innerHTML + linkHTML;
            // titleList.insertAdjacentHTML = titleList.insertAdjacentHTML('beforeend', linkHTML);
            html = html + linkHTML;
            console.log('html: ', html);
        }
        titleList.innerHTML = html;

        const links = document.querySelectorAll('.titles a');
        console.log('links: ', links);
    
        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
        }
    }

    generateTitleLinks();
}