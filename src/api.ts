
const API_KEY = "68774923ea59501be16d93cb96ea8fd6";

const BASE_PATH = "https://api.themoviedb.org/3";

// 인터페이스 정의 
interface IMovie{
    id:number;
    backdrop_path : string;
    poster_path: string;
    title: string;
    overview:string;
}
export interface IGetMoviesResults{
    dates:{
        maximum:string;
        minimum:string;
    }
    page: number;
    results:IMovie[];   // IMovie의 배열 
    total_pages:number;
    total_results:number;
}

export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`).then(
        (response) => response.json()
    );
};