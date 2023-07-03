import React from "react";
import Etc1 from "../../assets/img/board/etc1.png";
import Etc1_Dark from "../../assets/img/board/etc1-dark.png";

import "./Container.scss";

const Container = ({ header, dark, content, footer, styles, customClasses, children }) => {
	return (
		<div
			className={[...["container", dark ? "__dark" : ""], ...[...([customClasses] ?? "")]].join(
				" "
			)}
			style={{ ...styles }}
		>
			{header && (
				<header>
					<div className="title">
						<img src={header.logo_url} />
						{header.title ? header.title : "Title Here"}
					</div>
					<img src={dark ? Etc1_Dark : Etc1} />
				</header>
			)}
			<div className="content">
				{content || children ? (content ? content : children) : "No content found"}
			</div>
			<footer>{footer && footer}</footer>
		</div>
	);
};

export default Container;
