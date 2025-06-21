import React from 'react'
import { createRoot } from 'react-dom/client'
import ProfileCard from './ProfileCard.jsx'
import RotatingText from './RotatingText.jsx'
import GooeyNav from './GooeyNav.jsx';
import Threads from './Threads.jsx';
import '../style.css'
import smoothScroll from './utilites/smoothScroll.js';

// Рендер карточки профиля
const photoEl = document.getElementById('photo-card')
if (photoEl) {
  createRoot(photoEl).render(
    React.createElement(ProfileCard, {
      name: 'Алексей Гузев',
      title: 'Product Manager',
      handle: 'goozave',
      status: 'Online',
      contactText: 'Связаться',
      avatarUrl: './Изображение.png',
      showUserInfo: true,
      enableTilt: true,
      onContactClick: () => {
        document.getElementById('contact').scrollIntoView({ 
          behavior: 'smooth' 
        })
      }
    })
  )
}

// Рендер вращающегося заголовка
const heroEl = document.getElementById('rotating-headline')
if (heroEl) {
  // Оптимизированные фразы примерно одинаковой длины
  const rotatingPhrases = [
    'видение',
    'управление',
    'развитие',
    'планирование',
    'исследование',
    'тестирование'
  ];

  createRoot(heroEl).render(
    React.createElement('h1', {
      className: 'hero-title'
    }, [
      (window.innerWidth <= 800 ? 'Продуктовое' : 'Продуктовое⠀⠀'),
      React.createElement(RotatingText, {
        key: 'rotating-text',
        texts: rotatingPhrases,
        mainClassName: 'rotating-word',
        staggerFrom: 'last',
        initial: { y: '100%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '-120%', opacity: 0 },
        staggerDuration: 0.03,
        splitLevelClassName: 'overflow-hidden',
        elementLevelClassName: 'inline-block',
        transition: { 
          type: 'spring', 
          damping: 30, 
          stiffness: 400,
          mass: 0.8
        },
        rotationInterval: 2500,
        splitBy: 'characters'
      })
    ])
  )
}

// Render GooeyNav
const navEl = document.getElementById('gooey-nav');
if (navEl) {
  const items = [
    { label: 'Home', href: '#hero' },
    { label: 'Обо мне', href: '#about' },
    { label: 'Проекты', href: '#projects' },
    { label: 'Ценности', href: '#values' },
    { label: 'Факты', href: '#funfacts' },
    { label: 'Контакты', href: '#contact' },
  ];
  createRoot(navEl).render(
    React.createElement(GooeyNav, {
      items,
      particleCount: 15,
      particleDistances: [90, 10],
      particleR: 100,
      initialActiveIndex: 0,
      animationTime: 600,
      timeVariance: 300,
      colors: [1, 2, 3, 1, 2, 3, 1, 4],
    })
  );
}

// Render About section
const aboutEl = document.getElementById('about');
if (aboutEl) {
  const skills = [
    'Lean Canvas',
    'JTBD',
    'HADI-цикл',
    'OKR',
    'WSJF',
    'Unit-экономика',
    'A/B-тесты',
    'SQL',
    'ML',
    'Jira',
    'Confluence',
    'CJM',
    'Python (pandas, Jupyter)',
    'Figma',
    'Формирование Roadmap',
    'WYSIWYG'
  ];
  createRoot(aboutEl).render(
    React.createElement(
      React.Fragment,
      null,
      React.createElement('h2', { key: 'about-title' }, 'Обо мне'),
      React.createElement(
        'p',
        { key: 'about-text' },
        'Продукт-менеджер с опытом в B2B и SaaS. Выстраиваю стратегии, проверяю гипотезы, провожу эксперименты и оптимизирую метрики на основе данных.'
      ),
      React.createElement('h3', { key: 'skills-title' }, 'Навыки'),
      React.createElement(
        'div',
        { className: 'skills-list', key: 'skills-list' },
        skills.map((skill, idx) =>
          React.createElement('span', { className: 'skill', key: idx }, skill)
        )
      )
    )
  );
}

// Render Threads animation between sections
const threadsEl = document.getElementById('threads');
if (threadsEl) {
  createRoot(threadsEl).render(
    <div
      style={{
        width: '100%',
        height: '600px',
        position: 'relative',
        bottom: '0px',
        top: '-520px',
        marginBottom: '-1000px'
      }}
    >
      <Threads
        amplitude={1}
        distance={0}
        enableMouseInteraction={true}
        z-index={-1}
      />
    </div>
  );
}

// Добавляем плавное появление секций при скролле
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  // Наблюдаем за секциями
  document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section)
  })
}

// Запускаем наблюдение после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeElements)
} else {
  observeElements()
}

// Обработка отправки формы
const contactForm = document.querySelector('form[aria-label="Contact form"]')
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // Имитация отправки
    const button = contactForm.querySelector('button')
    const originalText = button.textContent
    
    button.textContent = 'Отправляется...'
    button.disabled = true
    
    setTimeout(() => {
      button.textContent = 'Отправлено ✓'
      button.style.background = '#10b981'
      
      setTimeout(() => {
        button.textContent = originalText
        button.disabled = false
        button.style.background = ''
        contactForm.reset()
      }, 2000)
    }, 1500)
  })
}

// Плавная прокрутка с кастомным easing
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      smoothScroll(targetSection, {
        duration: 1500,
        easing: 'easeOutCubic',
        offset: 0
      });
    }
  });
});

// Активация навигации при скролле
const updateActiveNavigation = () => {
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('nav a[href^="#"]')
  
  let currentSection = ''
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id')
    }
  })
  
  navLinks.forEach(link => {
    link.classList.remove('active')
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active')
    }
  })
}

// Слушатель скролла с throttling для производительности
let scrollTimeout
window.addEventListener('scroll', () => {
  if (scrollTimeout) return
  
  scrollTimeout = setTimeout(() => {
    updateActiveNavigation()
    scrollTimeout = null
  }, 16) // ~60fps
})

// Инициализация при загрузке
updateActiveNavigation()