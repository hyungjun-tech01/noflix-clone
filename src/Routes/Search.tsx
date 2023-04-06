import { useLocation } from "react-router-dom";

function Search(){
    const location = useLocation();

    //url에서 파라메터로 search 할 수 있도록 
    const keyword = new URLSearchParams(location.search).get("keyword");
    console.log(keyword);
    return null;
}
export default Search;