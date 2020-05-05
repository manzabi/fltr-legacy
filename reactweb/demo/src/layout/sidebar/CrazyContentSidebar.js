import React from 'react';

const CrazyContentSidebar = ({ elements, active, children }) => {
    return (
        <section className='content-sidebar'>
            {children !== undefined && children !== null &&
                <section className='content-sidebar-children-block' children={children} />
            }
            {
                elements.map((primaryElement) => {
                    if (primaryElement.content) {
                        return (
                            <section className='sidebar-section' key={primaryElement.id}>
                                <div
                                    id={primaryElement.id}
                                    onClick={primaryElement.action}
                                    className={`sidebar-element${primaryElement.id === active ? ' active' : ''}`}
                                >{primaryElement.name}</div>
                                {
                                    primaryElement.content.map((secondaryElement) => {
                                        if (!secondaryElement.disabled) {
                                            return (
                                                <div
                                                    onClick={secondaryElement.action}
                                                    className={secondaryElement.id === active && 'active' || ''}
                                                >{secondaryElement.name}</div>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })
                                }
                            </section>
                        );
                    } else {
                        if (!primaryElement.disabled) {
                            return (
                                <div
                                    key={primaryElement.id}
                                    className={`sidebar-element${primaryElement.id === active ? ' active' : ''}`}
                                    onClick={primaryElement.action}
                                >
                                    {primaryElement.name}
                                </div>
                            );
                        } else {
                            return null;
                        }
                    }
                })
            }
        </section>
    );
};

export default CrazyContentSidebar;