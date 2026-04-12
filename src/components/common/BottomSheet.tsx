import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, useDragControls } from 'motion/react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';

export default function BottomSheet() {
  const { isOpen, content, hideBottomSheet } = useBottomSheet();
  const controls = useAnimation();
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [isOpen, controls]);

  const onDragEnd = (event: any, info: any) => {
    // 滑动速度或位移达到阈值即触发关闭
    if (info.offset.y > 100 || info.velocity.y > 500) {
      hideBottomSheet();
    } else {
      // 回弹复位
      controls.start('visible');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 高斯模糊与蒙版层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={hideBottomSheet}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* 弹窗主体容器 */}
          <motion.div
            ref={sheetRef}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            initial="hidden"
            animate={controls}
            exit="hidden"
            variants={{
              visible: { y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
              hidden: { y: '100%', transition: { type: 'spring', damping: 25, stiffness: 200 } }
            }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-neutral-900 rounded-t-[32px] overflow-hidden max-h-[90vh] flex flex-col border-t border-neutral-800"
          >
            {/* 顶部的拖拽把手 */}
            <div
              className="w-full flex justify-center py-3 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-12 h-1.5 bg-neutral-700 rounded-full" />
            </div>

            {/* 动态内容区 */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-safe">
              {content}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
