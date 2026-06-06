/**
 * NEXUS DX Portal - Dashboard Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Real-Time Clock
    initClock();

    // 2. Initialize Chart.js Graphs
    initCharts();

    // 3. Initialize Task Board Click-to-Move Logic
    initTaskBoard();

    // 4. Initialize Navigation and Sidebar Interactions
    initNavigation();

    // 5. Initialize Notification Panel Toggle
    initNotifications();
});

/**
 * 1. Real-Time Clock
 */
function initClock() {
    const timeDisplay = document.getElementById('timeDisplay');
    if (!timeDisplay) return;

    function updateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        timeDisplay.textContent = `${year}年${month}月${date}日 ${hours}:${minutes}`;
        timeDisplay.setAttribute('datetime', now.toISOString());
    }

    updateTime();
    setInterval(updateTime, 60000); // Update every minute
}

/**
 * 2. Chart.js Graphs Configuration & Creation
 */
let revenueChartInstance = null;
let trafficChartInstance = null;

function initCharts() {
    // Chart.js Global Configurations
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded from CDN');
        return;
    }

    Chart.defaults.color = '#9ca3af';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleColor: '#f9fafb',
                bodyColor: '#9ca3af',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                titleFont: {
                    weight: '600'
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.04)',
                    tickColor: 'transparent'
                },
                ticks: {
                    color: '#9ca3af'
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.04)',
                    tickColor: 'transparent'
                },
                ticks: {
                    color: '#9ca3af'
                }
            }
        }
    };

    // --- Line Chart: Revenue & Traffic ---
    const revenueCanvas = document.getElementById('revenueChart');
    if (revenueCanvas) {
        const ctx = revenueCanvas.getContext('2d');
        
        // Custom background gradient for revenue line
        const blueGradient = ctx.createLinearGradient(0, 0, 0, 260);
        blueGradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
        blueGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        revenueChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [
                    {
                        label: '売上 (万円)',
                        data: [980, 1120, 1050, 1340, 1280, 1520],
                        borderColor: '#3b82f6',
                        backgroundColor: blueGradient,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointBackgroundColor: '#3b82f6',
                        pointHoverRadius: 6
                    },
                    {
                        label: 'アクセス数',
                        data: [2100, 2400, 2250, 2800, 3100, 3842],
                        borderColor: '#8b5cf6',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        borderWidth: 2,
                        pointBackgroundColor: '#8b5cf6',
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                ...commonOptions,
                plugins: {
                    ...commonOptions.plugins,
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: {
                            color: '#9ca3af',
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    }
                }
            }
        });
    }

    // --- Horizontal Bar Chart: Traffic Channels ---
    const trafficCanvas = document.getElementById('trafficChart');
    if (trafficCanvas) {
        const ctx = trafficCanvas.getContext('2d');

        trafficChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Organic Search', 'Direct', 'Social Media', 'Referral', 'Email'],
                datasets: [{
                    label: '割合 (%)',
                    data: [42, 28, 18, 8, 4],
                    backgroundColor: [
                        '#3b82f6', // Organic - Blue
                        '#6366f1', // Direct - Indigo
                        '#10b981', // Social - Green
                        '#f59e0b', // Referral - Amber
                        '#8b5cf6'  // Email - Purple
                    ],
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 16
                }]
            },
            options: {
                ...commonOptions,
                indexAxis: 'y',
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.04)'
                        },
                        ticks: {
                            color: '#9ca3af',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#f9fafb',
                            font: {
                                weight: '500'
                            }
                        }
                    }
                }
            }
        });
    }

    // Connect Period Controls (Dummy Behavior)
    const controlButtons = document.querySelectorAll('.chart-controls .control-btn');
    controlButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            controlButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            
            // Randomize line chart data slightly for visual response
            if (revenueChartInstance) {
                const isSixMonths = btn.textContent === '6ヶ月';
                let baseData1 = [980, 1120, 1050, 1340, 1280, 1520];
                let baseData2 = [2100, 2400, 2250, 2800, 3100, 3842];
                
                if (!isSixMonths) {
                    // simulate larger data range changes
                    baseData1 = baseData1.map(val => Math.round(val * (0.85 + Math.random() * 0.3)));
                    baseData2 = baseData2.map(val => Math.round(val * (0.85 + Math.random() * 0.3)));
                }
                
                revenueChartInstance.data.datasets[0].data = baseData1;
                revenueChartInstance.data.datasets[1].data = baseData2;
                revenueChartInstance.update('active');
            }
        });
    });
}

/**
 * 3. Task Board Click-to-Move Interactions
 */
function initTaskBoard() {
    const columns = {
        todo: {
            el: document.getElementById('col-todo'),
            countEl: document.getElementById('count-todo'),
            next: 'inprogress'
        },
        inprogress: {
            el: document.getElementById('col-inprogress'),
            countEl: document.getElementById('count-inprogress'),
            next: 'done'
        },
        done: {
            el: document.getElementById('col-done'),
            countEl: document.getElementById('count-done'),
            next: 'todo'
        }
    };

    // Bind event delegation on the board container
    const boardContainer = document.querySelector('.task-board-grid');
    if (!boardContainer) return;

    // Helper to recount cards in columns
    function updateColumnCounts() {
        Object.keys(columns).forEach(key => {
            const listContainer = columns[key].el.querySelector('.task-list-container');
            const count = listContainer.children.length;
            columns[key].countEl.textContent = count;
        });
    }

    boardContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.task-card');
        if (!card) return;

        const currentColumnEl = card.closest('.task-column');
        if (!currentColumnEl) return;

        const currentStatus = currentColumnEl.dataset.status;
        const nextStatus = columns[currentStatus].next;
        const targetColumnEl = columns[nextStatus].el.querySelector('.task-list-container');

        // Apply visual slide-out effect
        card.classList.add('moving');

        // After animation matches 300ms CSS transition
        setTimeout(() => {
            // Remove from current container and append to next
            card.parentNode.removeChild(card);
            
            // Adjust card styling/aria metadata if moving to completed (optional enhancement)
            const priorityBadge = card.querySelector('.task-priority');
            const tagBadge = card.querySelector('.task-tag');
            const title = card.querySelector('.task-title').textContent;
            
            if (nextStatus === 'done') {
                card.setAttribute('aria-label', `${title}. タグ: ${tagBadge.textContent}, 優先度: ${priorityBadge.textContent}. クリックで未着手へ移動`);
            } else if (nextStatus === 'todo') {
                card.setAttribute('aria-label', `${title}. タグ: ${tagBadge.textContent}, 優先度: ${priorityBadge.textContent}. クリックで進行中へ移動`);
            } else {
                card.setAttribute('aria-label', `${title}. タグ: ${tagBadge.textContent}, 優先度: ${priorityBadge.textContent}. クリックで完了へ移動`);
            }

            targetColumnEl.appendChild(card);
            
            // Remove animation class to trigger fade-in
            card.classList.remove('moving');
            
            // Re-calculate quantities
            updateColumnCounts();
        }, 300);
    });

    // Keyboard support for accessibility
    boardContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const card = e.target.closest('.task-card');
            if (card) card.click();
        }
    });
}

/**
 * 4. Navigation & Sidebar Interactions (Mobile Drawer & Page Title switching)
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('sidebar');

    const viewDetails = {
        dashboard: {
            title: 'ダッシュボード概要',
            sub: 'リアルタイムビジネスインテリジェンス'
        },
        analytics: {
            title: 'データ分析ポータル',
            sub: '多角的なデータビジュアライゼーション'
        },
        tasks: {
            title: 'プロジェクトタスク管理',
            sub: 'DevOpsスプリント＆カンバン'
        },
        security: {
            title: 'セキュリティ・ガバナンス',
            sub: 'リアルタイム脅威分析＆コンプライアンス監査'
        },
        settings: {
            title: 'システム環境設定',
            sub: 'ポータル構成とインテグレーション調整'
        }
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            if (!target) return;

            // Update active styling
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Update main titles
            if (pageTitle && viewDetails[target]) {
                pageTitle.textContent = viewDetails[target].title;
                pageSubtitle.textContent = viewDetails[target].sub;
            }

            // Close mobile sidebar if open
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    });

    // Mobile Sidebar Drawer Toggle
    if (mobileNavToggle && sidebar) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = sidebar.classList.contains('open');
            if (isOpen) {
                sidebar.classList.remove('open');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
            } else {
                sidebar.classList.add('open');
                mobileNavToggle.setAttribute('aria-expanded', 'true');
                mobileNavToggle.querySelector('i').className = 'fa-solid fa-xmark';
            }
        });

        // Close sidebar on tapping outside on mobile
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') && 
                !sidebar.contains(e.target) && 
                !mobileNavToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    }
}

/**
 * 5. Notification Panel Dropdown Toggle
 */
function initNotifications() {
    const bellBtn = document.getElementById('notificationBell');
    const panel = document.getElementById('notificationPanel');
    const markReadBtn = document.querySelector('.mark-read-btn');
    const badge = bellBtn ? bellBtn.querySelector('.bell-badge') : null;

    if (!bellBtn || !panel) return;

    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = panel.classList.contains('open');
        if (isOpen) {
            panel.classList.remove('open');
            bellBtn.setAttribute('aria-expanded', 'false');
        } else {
            panel.classList.add('open');
            bellBtn.setAttribute('aria-expanded', 'true');
        }
    });

    // Close panel on clicking outside
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !bellBtn.contains(e.target)) {
            panel.classList.remove('open');
            bellBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Clear notifications count on marking all as read
    if (markReadBtn) {
        markReadBtn.addEventListener('click', () => {
            document.querySelectorAll('.notification-item').forEach(item => {
                item.classList.remove('unread');
            });
            if (badge) {
                badge.style.display = 'none';
            }
        });
    }
}
