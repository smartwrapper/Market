import React, { memo, useState, useEffect } from 'react';
import styled from "styled-components";
import Clock from "../Clock";
import { navigate } from '@reach/router';
import api from '../../../core/api';
import {useVideo} from 'react-use';

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

//react functional component
const NftMusicCard = ({modalCallback ,nft, audioUrl, className = 'd-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4', height, onImgLoad }) => {
    const callbackmodal = modalCallback;
    const navigateTo = (link) => {
        navigate(link);
    }
     
  
    const useVideo1 = (url) => {
        
        const [video, state, controls, ref] = useVideo(
            <video height={height}  src={url} controls />
          );
        const [playing, setPlaying] = useState(false);
      
        const toggle = () => setPlaying(!playing);
      
        useEffect(() => {
            
            playing ? controls.play() : controls.pause();
          },
          [playing]
        );
      
        
      
        return [playing, toggle,video];
    };
    // const onPlayerReady = (player)=>{
    //     setVideo(player);
    // }
        const videoUrl = nft.preview_image?api.baseUrl+nft.preview_image.url:api.baseUrl;
        
        
        
          const  [playing, toggle,video] = useVideo1(videoUrl);

     
   

    return (
        <div className={className}>
            <div className="nft__item m-0">
                { nft.deadline &&
                    <div className="de_countdown">
                        <Clock deadline={nft.deadline} />
                    </div>
                }
                <div className="author_list_pp">
                    <span onClick={()=> navigateTo(nft.author_link)}>                                    
                        <img className="lazy" src={api.baseUrl + nft.author.avatar.url} alt="" style={{width: '50px', height: '50px', objectFit: 'cover'}}/>
                        <i className="fa fa-check"></i>
                    </span>
                </div>
                <div className="nft__item_wrap" style={{height: `${height}px`}}>
                    <Outer>
                    <span>
                        {/*<video height={height} className="lazy nft__item_preview" alt="" controls>
                                                      <source src={nft.img_url} type="video/mp4" />                                                       
                                                  </video> */} 
                        {video}
                    </span>
                    </Outer>
                    <div className="nft_type_wrap">
                        <div onClick={toggle} className="player-container">
                            <div className={`play-pause ${playing ? 'pause' : 'play'}`}></div>
                        </div>
                        <div className={`circle-ripple ${playing ? 'play' : 'init'}`}></div>
                    </div>
                </div>
                <div className="nft__item_info">
                    <span onClick={() => navigateTo(`${nft.nft_link}/${nft.id}`)}>
                        <h4>{nft.title}</h4>
                    </span>
                    <div className="nft__item_price">
                        {nft.price/1000000000000000000} ETH
                        {/* <span>{nft.bid}/{nft.max_bid}</span> */}
                    </div>
                    <div className="nft__item_action">
                        {/*<span onClick={() => navigateTo(`${nft.bid_link}/${nft.id}`)}>Place a bid</span>*/}
                        <span onClick={()=>{  callbackmodal(nft);  }} >{ 'Update Price' }</span>
                    </div>
                    <div className="nft__item_like">
                        <i className="fa fa-heart"></i><span>{nft.likes}</span>
                    </div>                            
                </div> 
            </div>
        </div>            
    );
};

export default memo(NftMusicCard);