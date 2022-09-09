import React ,{ useState, useEffect } from 'react';
import { Button, Input, Flex } from '@chakra-ui/react';

    export function NumberMintOpen ({HandleDecrement,MintAmount,HandleIncrement,HandleMint,json}) {

    const [btnMintText, setBtnMintText] = useState("");
    const [btnDisable, setBtnDisable] = useState(false);

        useEffect(() => {
            Of_iniData()
        },[json])
        
        function Of_iniData() {
            sellStatus()
            console.log("ini run")
        }
        

        function sellStatus (){
        
        if (json.totalSupply >= json.collectionSize) {
            // ขายหมด
            setBtnMintText("ขายหมดแล้ว")
            setBtnDisable(true)
            console.log("Sold Out")
    
        }
        else if (Boolean(json.statusWhitelistMint) == false && Boolean(json.statusPublicMint) == false) {
            //close
            setBtnMintText("Mint is Close 0-0")    
            setBtnDisable(true)
            console.log(" 0 - 0")
    
        }
        else if (Boolean(json.statusWhitelistMint) == true && Boolean(json.statusPublicMint) == false) {
            // Whitelist Round
            setBtnMintText("Mint Now (Whitelist)")
            setBtnDisable(false)
            console.log(" 1 - 0")
    
        }
        else if (Boolean(json.statusWhitelistMint) == false && Boolean(json.statusPublicMint) == true) {
            // Public Round
            setBtnMintText("Mint Now (Public)")
            setBtnDisable(false)
            console.log(" 0 - 1")
        }
        else if (Boolean(json.statusWhitelistMint) == true && Boolean(json.statusPublicMint) == true) {
            //close
            setBtnMintText("Mint is Close 1-1")
            setBtnDisable(true)
            console.log(" 1 - 1")
        }
        else {
            //close
            setBtnMintText("Mint is Close Else")
            setBtnDisable(true)
            console.log(" 0 - 0")
    
        }
    }

    console.log("btnDisable = ", btnDisable)

    return(
        <>
        
            <Flex align="center" justify="center">   
                <Button 
                    className="decrement"
                    cursor="pointer"
                    backgroundColor={btnDisable? "black":"red"}
                    onClick={HandleDecrement}
                    isDisabled={btnDisable}

                >
                    -
                </Button>
                
                <Input
                    border="0px solid"
                    readOnly
                    fontSize="20px"
                    fontFamily="Rubik"
                    width="130px"
                    height="60px"
                    textAlign="center"
                    paddingLeft="19px"
                    marginTop="10px"
                    type="number"
                    value={MintAmount}
                    isDisabled={btnDisable}
                />

                <Button 
                    className="increment"
                    cursor="pointer"
                    backgroundColor={btnDisable? "black":"red"}
                    onClick={HandleIncrement}
                    isDisabled={btnDisable}
                >
                    +
                </Button>
        </Flex>

        <Button
            className="mint"
            cursor="pointer"
            backgroundColor={btnDisable? "black":"red"}
            onClick={HandleMint}
            isDisabled={btnDisable}
            >
            {btnMintText}
        </Button>


        </>

    )

}