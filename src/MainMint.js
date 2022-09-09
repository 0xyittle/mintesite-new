import React, { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import NFT from './NFT.json';
import { HeaderX } from './HeaderX';
import { NumberMintOpen } from './NumberMintOpen';
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
window.Buffer = window.Buffer || require("buffer").Buffer;

const MainMint = ({ accounts, setAccounts}) => {

    //* START FIRST SETTING //
    const networkIdP = 4;
    const NFTAddress = "0x97934797183505802722aea0ad7ee549ac6f1801";
    const collectionSupply = 3333; //แตกต่างจาก collectionSize ตรงที่ ใน CollectionSize เอาไว้จำกัดการ mint ในแต่ระรอบ
    const wlPrice = 0.01;
    const pbPrice = 0.02;
    // แก้ ABI ที่ไฟล์ NFT.json
    // แก้ Whitelist Address ด้านล่าง
    // เอา Root อัพเดตบน SmartContract

    //* END FIRST SETTING //

    const [mintAmount, setMintAmount] = useState(1);
    const isConnected = Boolean(accounts[0]);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const [errorText, setErrorText] = useState("");

    const [proofP, setProofP] = useState("");

    const [lb_loading, set_lb_loading] = useState(true);

    const contract = new ethers.Contract(
        NFTAddress,
        NFT.abi,
        signer
    );
    
    const [json, setJson] = useState({})

    async function connectAccount() {
        if (window.ethereum) {

            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const networkId = await window.ethereum.request({
                    method: "net_version",
                });


                if (networkId == networkIdP) {

                    setErrorText("Connecting...")

                    // Start ดึงข้อมูล ลงข้อมือ

                    const totalSupply = await contract.totalSupply()
                    const totalSupplyX = Number(totalSupply) // change  _hex to number
        
                    const mintPrice = await contract.mintPrice();
                    const mintPriceX = ethers.utils.formatEther(mintPrice.toString()) // change wei to 0.0X eth

                    const maxPerAddress = await contract.maxPerAddress()
                    const maxPerAddressX = maxPerAddress.toString() // change  _hex to string

                    const collectionSize = await contract.collectionSize_();
                    const collectionSizeX = Number(collectionSize) // change  _hex to number

                    const statusWhitelistMint = await contract.whitelistMintActive()
                    const statusWhitelistMintX = Number(statusWhitelistMint) // change  _hex to number

                    const statusPublicMint = await contract.publicMintActive()
                    const statusPublicMintX = Number(statusPublicMint) // change  _hex to number


                    setJson({

                        totalSupply : totalSupplyX,
                        mintPrice : mintPriceX,
                        maxPerAddress : maxPerAddressX,
                        collectionSize : collectionSizeX,
                        statusWhitelistMint : statusWhitelistMintX,
                        statusPublicMint : statusPublicMintX

                    })

                    console.log("xxxxxxxxx-IN", json.totalSupply)


                    const userAddress = accounts[0]

                    // END ดึงข้อมูล ลงข้อมือ

                    // START MerkleTree

                    let whitelistAddresses = [
                        "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
                        "0x5A641E5FB72A2FD9137312E7694D42996D689D99",
                        "0xDCAB482177A592E424D1C8318A464FC922E8DE40",
                        "0x6E21D37E07A6F7E53C7ACE372CEC63D4AE4B6BD0",
                        "0x09BAAB19FC77C19898140DADD30C4685C597620B",
                        "0xCC4C29997177253376528C05D3DF91CF2D69061A",
                        "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
                        "0x542A7F54569685f357Da5B8a6106Fe3DDcDA996b",
                        "0xD4F2CDE48EE30962aC4DBFEc193Ad46223bCbE6a",
                      ];

                      const leaves = whitelistAddresses.map((x) => keccak256(x))
                      const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })

                      const root = tree.getRoot()

                      const leaf = keccak256(userAddress);
                      // const leaf = keccak256("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4")

                      const buf2hex = x => '0x' + x.toString('hex')

                      const proof = tree.getProof(leaf).map(x => buf2hex(x.data))
                      setProofP(proof)


                      const verify = tree.verify(proof, leaf, root)
                      
                    // END MerkleTree

                    setAccounts(accounts);
                    setErrorText("Connect metamask success.")

                } else {
                    //เปลี่ยนข้อความบนปุ่ม  switch to ... chain  แล้วกดปุ่มไป จะขึ้นหน้าต่างให้เปลี่ยนเชน

                    setErrorText("Please change network to Rinkeby.")
                    
                    // window.ethereum.request({
                    //     method: "wallet_addEthereumChain",
                    //     params: [{
                    //         chainId: "0x4",
                    //         rpcUrls: ["https://rinkeby.infura.io/v3/"],
                    //         chainName: "Rinkeby Test Network",
                    //         nativeCurrency: {
                    //             name: "RinkebyETH",
                    //             symbol: "RinkebyETH",
                    //             decimals: 18
                    //         },
                    //         blockExplorerUrls: ["https://rinkeby.etherscan.io"]
                    //     }]
                    // });
                    
                }

            } catch (err){
                setErrorText("Something went wrong. Please refresh this page.")
                console.log(err)
            }
        } else {
            setErrorText("Please install metamask.")
        }
    }

    console.log(json.statusWhitelistMint , " - ", json.statusPublicMint )

    //log
    console.log("Whitelist Mint Status : ", json.statusWhitelistMint)
    console.log("Public Mint Status : ", json.statusPublicMint)
    console.log("minted : ", json.totalSupply ,"/" , json.collectionSize)
    console.log("mint price : ",json.mintPrice, "eth")
    console.log("maxPerAddress : ", json.maxPerAddress)
    console.log("Collection Size : ", json.collectionSize)

    async function handleMint() {
        if (window.ethereum) {
            try {

                if (Boolean(json.statusWhitelistMint) == false && Boolean(json.statusPublicMint) == true) {
                    
                    const response = 
                    await contract.publicMint
                    (
                        BigNumber.from(mintAmount),
                        {
                            value: ethers.utils.parseEther((json.mintPrice * mintAmount).toString()),
                        }
                    
                    );


                }
                else if (Boolean(json.statusWhitelistMint) == true && Boolean(json.statusPublicMint) == false) {

                    const response = 
                    await contract.mintWhiteList
                    (
                        BigNumber.from(mintAmount),
                        proofP,
                        {
                            value: ethers.utils.parseEther((json.mintPrice * mintAmount).toString()),

                        }
                    
                    );

                }
                else {
                    
                    
                }

            } catch (err) {
                console.log("error: ", err)
                setErrorText(err.error.message)
            }
        }
    }

    const handleDecrement = () => {
        if (mintAmount <= 1) return;
        setMintAmount(mintAmount - 1);
    }

    const handleIncrement = () => {
        if (mintAmount >= json.maxPerAddress) return;
        setMintAmount(mintAmount + 1);
    }


    useEffect(() => {
        Of_iniData()
    },[])
    
    function Of_iniData() {
        set_lb_loading(false)
    }
    if(lb_loading){
        return (
            <div>
                <Flex justify="center" align="center" height="100vh" paddingBottom="250px">
                    <Box width="520px">
                        <HeaderX />
                    </Box>
                </Flex>
            </div>
        )
    }
    else {

        return (

            <div>
                <Flex justify="center" align="center" height="100vh" paddingBottom="250px">
                    <Box width="520px">
                        
                    <HeaderX />

                        {isConnected ? (
                                <div>
                                    <Text
                                    marginTop="20px"
                                    fontSize="30px"
                                    letterSpacing="-5.5%"
                                    fontFamily="Rubik"
                                    color="red"
                                    
                                    >Total Supply : {collectionSupply}</Text>

                                    <Text
                                    marginTop="20px"
                                    fontSize="30px"
                                    letterSpacing="-5.5%"
                                    fontFamily="Rubik"
                                    color="red"
                                    
                                    >Minted : {json.totalSupply}/{json.collectionSize}</Text>

                                    <Text
                                    marginTop="20px"
                                    fontSize="30px"
                                    letterSpacing="-5.5%"
                                    fontFamily="Rubik"
                                    color="red"
                                    
                                    >Price : {json.mintPrice} Ξ</Text>

                                    <NumberMintOpen
                                        HandleDecrement = {handleDecrement}
                                        HandleIncrement = {handleIncrement}
                                        MintAmount = {mintAmount}
                                        HandleMint = {handleMint}
                                        json = {json}
                                    />

                                    <Text
                                    marginTop="20px"
                                    fontSize="30px"
                                    letterSpacing="-5.5%"
                                    fontFamily="Rubik"
                                    color="red"
                                >{errorText}</Text>

                                </div>


                            ) : (
                            <div>
                                <Text
                                    marginTop="70px"
                                    fontSize="30px"
                                    letterSpacing="-5.5%"
                                    fontFamily="Rubik"
                                    color="red"
                                >
                                    You must be connected to Mint.
                                </Text>
                                
                                <Button
                            className="connect"
                            cursor="pointer"
                            onClick={connectAccount}
                            
                                >
                                    Connect wallet
                                </Button>

                                <Text
                                    marginTop="20px"
                                    fontSize="30px"
                                    letterSpacing="-5.5%"
                                    fontFamily="Rubik"
                                    color="red"
                                >{errorText}</Text>

                            </div>
                            )}
                    </Box>
                </Flex>
            </div>
        );
    }
};

export default MainMint;