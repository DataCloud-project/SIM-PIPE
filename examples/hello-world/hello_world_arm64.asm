.section .data
    msg:
        .ascii "Hello, World!\n"
        .align 2

.section .text
        .globl  _start
        .type   _start, %function
_start:
    mov     x0, #1      // write(1, msg, 13)
    adr     x1, msg
    mov     x2, #14
    mov     x8, #64
    svc     #0

    mov     x0, #0      // exit(0)
    mov     x8, #93
    svc     #0

// This code will write the message "Hello, World!" to the standard output.
// The ARM64 architecture uses the svc (supervisor call) instruction to invoke system calls.
// The first argument to a system call is passed in x0, the second in x1, and so on.
// The value #1 in x0 specifies the write system call, x1 points to the message to write,
// and x2 specifies the length of the message. The second system call with x0 set to #0 is the
// exit system call, which terminates the program.