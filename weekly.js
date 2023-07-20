
// Articles

function getArticles(document) {
  let articleCategory = 'topnews'

  const result = [...document.querySelectorAll('.desc')].map(desc => {
    const [title, ...content] = desc.childNodes;
    const a = title.querySelector('a')
    let img

    // find article's head image
    let imageElem = desc.parentNode?.parentNode?.parentNode?.parentNode?.previousElementSibling
    if (imageElem?.classList.contains('el-fullwidthimage')) {
      img = imageElem.querySelector('img').src
    // 前一个元素可能是虚线，因此在往上找一次
    } /* else if ((imageElem = imageElem?.previousElementSibling)?.classList.contains('el-fullwidthimage')) {
      img = imageElem.querySelector('img').src
    } */

    // find article's category
    if (img) {
      const heading = imageElem?.previousElementSibling
      if (heading?.classList.contains('el-heading')) {
        articleCategory = heading.querySelector('p')?.innerHTML || ''
      }
    } else {
      const heading = desc.parentNode?.parentNode?.parentNode?.parentNode?.previousElementSibling
      if (heading?.classList.contains('el-heading')) {
        articleCategory = heading.querySelector('p')?.innerHTML || ''
      }
    }

    // combine description info
    let frag = document.createElement('div');
    content.forEach(i => {
      frag.appendChild(i.cloneNode(true))
    })
    const description = frag.innerHTML.replace('— ', '').trim()
    frag = null

    return {
      title: title.textContent,
      link: a.href,
      description,
      source: a.title,
      author: desc.nextElementSibling?.textContent,
      img,
      category: articleCategory
    }
  })
    // filter out `sponsor` & `Jobs`
    .filter(({ author }) => author && !author.includes('sponsor'))

  return result;
}

// ⚡️ IN BRIEF & RELEASES & so on...

function getOthers(document) {
  const result = [...document.querySelectorAll('strong')].map(strong => {
    const category = strong.innerHTML.replace(':', '')
    const list = [...(strong.parentNode?.nextElementSibling?.querySelectorAll('p') || [])]
    const items = list.map(li => {
      return {
        link: li.querySelector('a')?.href,
        description: li.innerHTML.replace('— ', '').trim(),
        category
      }
    })

    return items
  })
    // filter out empty list
    .filter(list => list.length > 0)
    .flat()

  return result;
}



module.exports = {
  getWeekly(...docs) {
    return {
      articles: docs.map(document => {
        return getArticles(document).concat(getOthers(document))
      }).flat()
    }
  }
}
