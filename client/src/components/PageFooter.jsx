import React from 'react'

export default function PageFooter() {
  return (
    <div>
       <p className="links">
                <span className="linkItem">友情链接：</span>
                <a
                    href="http://blog.moonxi.top/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    Moonxi's Space
                </a>
                <a
                    href="http://www.yuanjin.tech/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    袁进的博客
                </a>
                <a
                    href="http://yanhongzhi.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    Mr.Yan
                </a>
                <a
                    href="https://blog.csdn.net/jackfrued"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    骆昊的技术专栏
                </a>
            </p>
            <p>© 2023 - Coder Station</p>
            <p>Powered by Create React App</p>
    </div>
  )
}
