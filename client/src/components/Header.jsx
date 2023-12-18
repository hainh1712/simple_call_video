import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button, Dropdown, Space, Input} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
const Header = ({ onSearch }) => {
  const location = useLocation();
  const authInfo = useAuth();
  const navigate = useNavigate();
  const {user, isLoggedIn, logout } = authInfo
    ? authInfo
    : { isLoggedIn: false, logout: () => {} };
  const handleMenuClick = (e) => {
    switch (e.key) {
      case '1': 
        navigate('/profile');
        break;
      case '2':
        logout();
        break;
      default:
        break;
    }
  };
  const items = [
    {
      label: 'Profile',
      key: '1',
    },
    {
      label: 'Log out',
      key: '2',
    },
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const { Search } = Input;
  const handleSearch = (value) => {
    onSearch(value);
  };

  return (
    <>
      <div className="bg-white h-14 flex items-center sticky top-0">
        <div className="font-bold text-[20px] leading-5 pl-6">HEDSOCIAL</div>
        <div className="w-1/5 px-1 py-1.5 mx-10 flex items-center text-center">
          <Link
            to="/"
            className={`${location.pathname === '/' ? 'w-1/2 bg-[#eeeeee] rounded-lg px-1 py-1.5 text-[#0079D3] font-bold text-[15px] mr-2' : 'w-1/2 font-bold text-[15px] text-black opacity-50'}`}
          >
            HOME
          </Link>
          <Link
            to="/video-call"
            className={`${location.pathname === '/video-call' ? 'w-1/2 bg-[#eeeeee] rounded-lg px-1 py-1.5 text-[#0079D3] font-bold text-[15px]' : 'w-1/2 font-bold text-[15px] text-black opacity-50'}`}
          >
            VIDEO CALL
          </Link>
        </div>
        {/* <SearchBar /> */}
        <div className="w-full">
          <Search placeholder="Search" allowClear style={{ width: '70%' }} onSearch={handleSearch}/>
        </div>
        <div className="flex items-center text-center w-1/6">
          {isLoggedIn ? (
            <div className="flex items-center justify-center">
              <Space wrap>
                <Dropdown menu={menuProps} className="border-0 shadow-none">
                  <Button>
                    <Space>
                      <img
                        src={user?.avatar_url ? user.avatar_url : "/social-media.png"}
                        alt="user"
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      <span className="font-bold mr-4">{user?.name}</span>
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </Space>
              {/* <button
                className="bg-[#0e64d2] text-white rounded-lg px-4 py-2"
                onClick={logout}
              >
                Logout
              </button> */}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#0e64d2] text-white rounded-lg px-4 py-2"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
export default Header;
