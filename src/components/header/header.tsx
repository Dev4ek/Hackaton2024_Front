import React from "react";

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__wrap">
                <div className="header__logo"><span>Квиентиум Молоток</span></div>

                <div className="header__auth">
                    <div className="auth-role">Менеджер</div>
                    <div className="auth-username"><img src="img/icons/user.svg" alt="Никита Ящеров"/><span>Никита Ящеров</span></div>
                </div>
                </div>
            </div>
        </header>
    );
}

export default Header;