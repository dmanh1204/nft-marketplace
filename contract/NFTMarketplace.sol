// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}

contract MyERC721 is ERC721Enumerable, Ownable {
    
    using Strings for uint256;
    
    // Optional mapping for token URIs
    mapping (uint256 => string) private tokens;

    event Mint(uint indexed id, address indexed account);

    // Base URI
    string private _baseURIextended;


    constructor() ERC721("MyERC721", "TEST") {}
    
    function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIextended = baseURI_;
    }
    
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        tokens[tokenId] = _tokenURI;
    }
    
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = tokens[tokenId];
        string memory base = _baseURI();
        
        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }
    
    mapping(address => bool) minted;

    function mint(
        address _to,
        string memory tokenURI_
    ) public {
        require(!minted[_msgSender()], "an account only can minted once time");
        minted[_msgSender()] = true;
        uint256 _tokenId = totalSupply();
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, tokenURI_);
        emit Mint(_tokenId, _to);
    }
    
    function burn(uint256 _tokenId) public {
        _burn(_tokenId);
    }
}

contract NFTMarketplace is MyERC721 {
    mapping(uint256 => bool) public isOrdering;
    mapping(uint256 => uint256) public orderingIndex;
    mapping(uint256 => uint256) public orderingPrices;
    uint256[] public ordering;
    mapping(uint256 => bool) isTransacting;
    mapping(address => uint256) remainFees;

    event OwnerChange(uint256 indexed id, address indexed oldOwner, address indexed newOwner);

    modifier ensureOrdering(uint256 id) {
        require(isOrdering[id], "product is not ordering");
        _;
    }

    modifier transacting(uint256 id) {
        require(!isTransacting[id], "transacting...");
        isTransacting[id] = true;
        _;
        isTransacting[id] = false;
    }

    modifier onlyOwnerNft(uint256 id) {
        require(ownerOf(id) == _msgSender(), "only owner of nft");
        _;
    } 

    function order(uint256 id, uint256 price) external onlyOwnerNft(id) {
        require(!isOrdering[id], "product is ordering");
        require(getApproved(id) == address(this), "not approve product to sell");
        setApprovalForAll(address(this), true);
        isOrdering[id] = true;
        orderingIndex[id] = ordering.length;
        ordering.push(id);
        orderingPrices[id] = price;
    }

    function getOrdering() external view returns(uint256[] memory) {
        return ordering;
    }

    function _deleteOrder(uint256 id) private {
        isOrdering[id] = false;
        if(orderingIndex[id] < ordering.length - 1) {
            ordering[orderingIndex[id]] = ordering[ordering.length - 1];
        }
        ordering.pop();
        delete orderingIndex[id];
        delete orderingPrices[id];
    }

    function cancelOrder(uint256 id) external onlyOwnerNft(id) ensureOrdering(id) {
       _deleteOrder(id);
    }

    function buyOrder(uint256 id) external payable ensureOrdering(id) transacting(id) {
        require(msg.value >= orderingPrices[id], "not enough fee to buy");
        address owner = ownerOf(id);
        this.transferFrom(owner, _msgSender(), id);
        (bool success, ) = owner.call{value: orderingPrices[id]}("");
        require(success);
        remainFees[_msgSender()] += (msg.value - orderingPrices[id]);
        _deleteOrder(id);
        emit OwnerChange(id, owner, _msgSender());
    }

    function withdrawFee() external {
        require(remainFees[_msgSender()] > 0, "no fee remain to withdraw");
        (bool success, ) = _msgSender().call{value: remainFees[_msgSender()]}("");
        require(success);
        delete remainFees[_msgSender()];
    }
}