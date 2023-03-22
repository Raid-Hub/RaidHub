interface SidebarProps {

}

const Sidebar = ({ }: SidebarProps) => {
    return (
        <div className="sidebar">
            <div className="profile">
                <div className="profile-banner">
                    <img className="image-background" src="images/Bruce_Final.png" alt="" />
                </div>

                <div className="profile-image">
                    <img src="images/bruce.png" alt="" />
                    <p>Bruce<span>#2366</span></p>
                </div>

                <p className="linked-text">Linked Accounts</p>
                <img src="images/icons.png" alt="" className="img-social"/>
            </div>

            <div className="profile-banners">
                <img src="images/Skull.png" alt="" />

                <div className="banners-text">
                    <p>Clears Rank</p>
                    <p className="bold-banner">Challenger #1</p>
                    <p>1hr 01ms 01s</p>
                </div>
            </div>

            <div className="profile-banners">
                <img src="images/speed.png" alt="" />

                <div className="banners-text">
                    <p>Speed Rank</p>
                    <p className="bold-banner">Challenger #1</p>
                    <p>1hr 01ms 01s</p>
                </div>
            </div>

            <div className="description">
                <img className="desc-img" src="images/Codex Banner.png" alt="" />

                <div className="description-right">
                    <p className="desc-title">SNOW [わ]</p>
                    <p className="desc-subtitle">"七転び八起き"</p>
                    <p className="desc-text">Requirements: Clarify's approval</p>

                    <div className="description-list">
                        <img src="images/Diamond.png" alt="" />
                        <p>Trio Flawless <span>x150</span></p>
                    </div>

                    <div className="description-list">
                        <img src="images/Diamond.png" alt="" />
                        <p>Trio Flawless <span>x150</span></p>
                    </div>

                    <div className="description-list">
                        <img src="images/Diamond.png" alt="" />
                        <p>Trio Flawless Master<span>x150</span></p>
                    </div>
                </div>
            </div>

            <div className="token">
                <img src="images/logo.png" alt="" />

                <div className="token-text-content">
                    <p className="token-title">RaidHub Founder</p>
                    <p className="token-text">The user contributed to creating RaidHub</p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;