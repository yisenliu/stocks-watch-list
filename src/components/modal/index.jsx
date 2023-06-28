import './modal.sass';
import { useEffect, useState } from 'react';
import { ModalContext } from './context/ModalContext';
import Body from './Body';
import Container from './Container';
import Content from './Content';
import Dialog from './Dialog';
import Header from './Header';
import Footer from './Footer';
import Overlay from './Overlay';

export default function Modal({ id, open, onClose, children, title, footer }) {
  const [active, setActive] = useState(open);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setActive(true), 0);
    } else {
      document.body.style.overflow = null;
    }
  }, [open]);

  return (
    active && (
      <ModalContext.Provider value={{ setActive, onClose, open }}>
        <Container id={id}>
          <Dialog>
            <Content>
              <Header title={title} />
              <Body>{children}</Body>
              {footer && <Footer>{footer}</Footer>}
            </Content>
          </Dialog>
          <Overlay />
        </Container>
      </ModalContext.Provider>
    )
  );
}
