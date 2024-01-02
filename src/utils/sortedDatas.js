export default (datas, sort) => {
    console.log(datas)
    if (sort === "desc")
        return datas.sort((a, b) => b.title1.localeCompare(a.title1));
    else if (sort === "asc") {
        return datas.sort((a, b) => a.title1.localeCompare(b.title1));
    }
};