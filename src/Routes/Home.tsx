import { useQuery } from "react-query";
import styled from "styled-components";
import {getMovies, IGetMoviesResults} from "../api";
import {makeImagePath} from "../utils";
import {motion, AnimatePresence, useScroll} from "framer-motion";
import {useState} from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
    background : black;
`;
const Loader = styled.div`
    height:20vh;
    text-align:center;
    display: flex;
    justify-content: cener;
    align-items: center;
`;
const Banner = styled.div<{bgPhoto:string}>`
    height:100vh;
    display:flex;
    flex-direction: column;
    justify-content: center;
    padding:60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url(${(props) => props.bgPhoto});
    background-size:cover;
`;
const Title = styled.h2`
    font-size : 40px;
    margin-bottom: 20px;;
`;
const Overview = styled.p`
    font-size: 20px;;
    width:50%;
`;

const Slider = styled.div`
    position: relative;
    top:-200px;
`;

//    position:absolute;
const Row = styled(motion.div)`
    display: grid;
    gap:10px;
    grid-template-columns :repeat(6, 1fr);
    position:absolute;
    width:100%;
`;

const Box = styled(motion.div)<{bgPhoto:string}>`
    background-color:white;
    background-image: url(${(props) => props.bgPhoto});
    background-size : cover;
    background-position:center center;
    height:200px;
    font-size:20px;
    cursor:pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
 `;
const Info = styled(motion.div)`
    padding:20px;
    background-color:${(prop) => prop.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
      text-align: center;
      font-size: 18px;
    }
`;
const Overlay = styled(motion.div)`
    position: fixed;
    top:0;
    width : 100%;
    height:100%;
    background-color: rgba(0,0,0,0.5);
    opacity:0;
`;

const BigMovie = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height:80vh;
    left:0;
    right:0;
    margin: 0 auto;
    border-radius : 15px;
    overflow : hidden;
    background-color: ${props=>props.theme.black.lighter};
`;
const BigCover = styled.img`
    width:100%;
    background-size : cover;
    background-position:center center;
    height:300px;
`;
const BigTitle = styled.h3`
    color : ${props=>props.theme.white.lighter};
    text-align : left;
    padding:20px;
    font-size: 28px;
    position:relative;
    top:-80px;
`;

const BigOverview = styled.p`
    padding:10px;
    position:relative;
    top:-80px;
    color: ${props =>props.theme.white.lighter}; 
`;

const rowVariants = {
    hidden : {
        x:window.outerWidth-10,
    },
    visible: {
        x:0,
    },
    exit: {
        x:-window.outerWidth+10,
    },
}

const BoxVariants = {
    normal :{
        scale : 1,
    },
    hover:{
        opacity:1,
        y:-80,
        scale : 1.3,
        transition : {
            delay:0.3,
            duration:0.2,
            type:"tween"
        },
    },
}
const infoVariants = {
    hover:{
        opacity:1, 
    }
}

function Home(){
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId");
    const {data, isLoading} = useQuery<IGetMoviesResults>(["movies", "nowPlaying"],getMovies);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const offset = 6;
    const {scrollY} = useScroll();
    const increaseIndex = ()=>{
        if(data){
            if(leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.ceil(totalMovies/offset)-1;
            console.log('maxindex' ,totalMovies, maxIndex);
            setIndex( (prev)=>(prev===maxIndex ? 0:prev+1) );    
        }
    };
    const toggleLeaving = () => {setLeaving(prev => !prev)};
    const onBoxClick = (movieId:number)=> {
        history.push(`/movies/${movieId}`); // url을 변경 ..
    }
    const onOverlayClick = ()=>{history.push(`/`);}
    const clickedMovie = bigMovieMatch?.params.movieId && 
       data?.results.find(
           (movie)=>String(movie.id) === bigMovieMatch.params.movieId 
    );
    console.log(clickedMovie);
    return (
        <Wrapper>
            {isLoading? <Loader>Loading...</Loader>:
            <>
                <Banner onClick={increaseIndex} 
                bgPhoto={makeImagePath(data?.results[0].backdrop_path || "" )}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
                <Slider>
                    <AnimatePresence initial = {false} onExitComplete={toggleLeaving}>
                    <Row 
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{type:"tween", duration:1}}
                    key={index}>
                       {data?.results
                       .slice(offset*index, offset*index+offset)
                       .map((movie)=>(
                        <Box 
                            layoutId={movie.id+""} 
                            key={movie.id}
                            onClick={()=>onBoxClick(movie.id)}
                            bgPhoto={makeImagePath(movie.poster_path || "","w500" )} 
                            variants = {BoxVariants}
                            initial = "normal"
                            whileHover="hover"
                            transition={{ type:"tween"}}
                            >
                                <Info variants={infoVariants}/>
                                </Box>
                         ))
                       }
                    </Row>
                    </AnimatePresence>
                </Slider>
                <AnimatePresence>
                   { bigMovieMatch ? ( 
                    <>
                        <Overlay onClick={()=> onOverlayClick()}
                            exit={{opacity:0}}
                        ></Overlay>
                        <BigMovie 
                                style = {{ top:scrollY.get()+100 }}
                                layoutId= {bigMovieMatch.params.movieId} > 
                            {clickedMovie && <>
                            <BigCover style = {{
                                backgroundImage:`url(${makeImagePath(clickedMovie.backdrop_path, "w500")})`
                            }}></BigCover>
                            <BigTitle>{clickedMovie.title}</BigTitle>
                            <BigOverview>{clickedMovie.overview}</BigOverview>
                            </>}
                        </BigMovie>
                    </>    
                    ): null
                    }
                </AnimatePresence>
            </> }
        </Wrapper>
    );
}
export default Home;