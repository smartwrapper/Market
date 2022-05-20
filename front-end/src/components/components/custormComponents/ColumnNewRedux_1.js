import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../store/selectors';
import * as actions from '../../../store/actions/thunks';
import { clearNfts, clearFilter,filterStatus } from '../../../store/actions';
import NftCard1 from './NFTCard1';
import NftMusicCard from './NFTMusicCard1';
import { shuffleArray } from '../../../store/utils';
import Switch from "react-switch";
import request from '../../../core/auth/request';
import api from "../../../core/api";
import auth, { nftsUrl } from '../../../core/auth';
import {updatePriceById} from "../../../core/nft/interact";

//react functional component
const ColumnNewRedux = ({ showLoadMore = true, shuffle = false, authorId = null }) => {
    const jwt = auth.getToken();
    const authorsState = useSelector(selectors.authorsState);
    const author = authorsState.data ? authorsState.data[0] : null;

    const dispatch = useDispatch();
    const nftItems = useSelector(selectors.nftItems);
    const nfts = nftItems ? shuffle ? shuffleArray(nftItems) : nftItems : [];
    const [height, setHeight] = useState(0);
    const [ismModal,setIsModal] = useState(false);
    const [mdUpPrice,setMdUpPrice] = useState(0);
    const [mdIsListed,setMdIsListed] = useState({checked:false});
    const [curElement,setCurElement] = useState({});
    const onImgLoad = ({target:img}) => {
        let currentHeight = height;
        if(currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }
   
    
    useEffect(() => {
        dispatch(actions.fetchNftsBreakdown(authorId));
        // dispatch(filterStatus({value:"has_offers",singleSelect:true}));

    }, [dispatch, authorId]);

    //will run when component unmounted
    useEffect(() => {
        
        return () => {
            dispatch(clearFilter());
            dispatch(clearNfts());
         
        }
    },[dispatch]);
    const setModal = (nft)=>{
        if(nft.status==="has_offers")
            setMdIsListed({checked:false})
        else
            setMdIsListed({checked:true});
         setIsModal(true);
         setCurElement(nft);
    }
    const handleListed = (checked)=>{
        setMdIsListed({checked});
    }
    const loadMore = () => {
        dispatch(actions.fetchNftsBreakdown(authorId));
    }
    const handleUpdate = (price)=>{    
        setIsModal(false);
        console.log(curElement);
        updatePriceById(curElement.tokenId,price,mdIsListed.checked,function(success){
            if(success){
                handleSubmitForm({...curElement,status:mdIsListed.checked?"buy_now":"has_offers",price:price},curElement.id);
            }
        });
    }
    const handleSubmitForm = async (data,nftId) => {
        const requestURL = nftsUrl(nftId);
        await request(requestURL, { method: 'PUT', body: data})
        .then((response) => {
            console.log(response)
           
        }).catch((err) => {
            console.log(err);
        });

    }
    return (
       <>
        <div className='row'>
            {nfts && nfts.map( (nft, index) => (
                nft.category === 'music' ?
                <NftMusicCard modalCallback={setModal} nft={nft} audioUrl={nft.audio_url} key={index} height={height} onImgLoad={onImgLoad}  />
                :
                <NftCard1  modalCallback={setModal} nft={nft} key={index} onImgLoad={onImgLoad} height={height} />
            ))}
            { showLoadMore && nfts.length <= 20 &&
                <div className='col-lg-12'>
                    <div className="spacer-single"></div>
                    <span onClick={loadMore} className="btn-main lead m-auto">Load More</span>
                </div>
            }
            
        </div> 
        { ismModal==true &&
            <div className='checkout'>
            <div className='maincheckout' style={{margin:`100px 0 0`}}>
            <button className='btn-close' onClick={() => setIsModal(false)}>x</button>
                <div className='heading'>
                    <h3>Please update price</h3>
                </div>
              
                <div className='detailcheckout mt-4'>
                    <div className='listcheckout'>
                     <div className="listSwitch" style={{display:"flex",justifyContent:"space-around"}}>
                      <h6 >
                        Set Listing to  
                        <span className="color">market.</span>
                      </h6>

                    <Switch onChange={handleListed} checked={mdIsListed.checked}  />
                     </div>
                  
                    <hr />
                  <h6>
                    Enter quantity. 
                    <span className="color">10 available</span>
                  </h6>
                  <input type="number" onChange={(e)=>{setMdUpPrice(e.target.value)}}  name="buy_now_qty" id="buy_now_qty" className="form-control"/>
                    </div>

                </div>
               
                <button className='btn-main lead mb-5' onClick={()=>{handleUpdate(mdUpPrice);}}>Update</button>
            </div>
            </div>
        }
        </>

    );
};

export default memo(ColumnNewRedux);