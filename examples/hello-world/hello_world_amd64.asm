.section .data
msg: .asciz "Hello, World!\n"

.section .text
.globl _start
_start:
    movq $1,   %rax  # system call number (sys_write)
    movq $1,   %rdi  # file descriptor (stdout)
    movq $msg, %rsi  # message to write
    movq $14,  %rdx  # message length
    syscall          # call kernel

    movq $60,  %rax  # system call number (sys_exit)
    xorq %rdi, %rdi  # return value
    syscall          # call kernel
