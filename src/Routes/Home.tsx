import { useQuery } from "react-query";
import styled from "styled-components";
import {getMovies, IGetMoviesResults} from "../api";
import {makeImagePath} from "../utils";
import {motion, AnimatePresence} from "framer-motion";
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
    color:red;
    font-size:20px;  
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
        y:-30,
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
    console.log(bigMovieMatch);
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
                   <motion.div 
                       layoutId= {bigMovieMatch.params.movieId}
                       style={{
                            position: "absolute",
                            width: "40vw",
                            height:"80vh",
                            backgroundColor: "red",
                            top:50,
                            left:0,
                            right:0,
                            margin: "0 auto",
                        }} /> 
                      ): null
                    }
                </AnimatePresence>
            </> }
        </Wrapper>
    );
}
export default Home;