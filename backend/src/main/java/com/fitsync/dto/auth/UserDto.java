package com.fitsync.dto.auth;


public class UserDto {
    private String id;
    private String name;
    private String email;
    private String role;
    private String avatar;
    private String phone;
    private String joinedDate;

    public UserDto() {}

    public UserDto(String id, String name, String email, String role, String avatar, String phone, String joinedDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role != null ? role.toLowerCase() : "member";
        this.avatar = avatar;
        this.phone = phone;
        this.joinedDate = joinedDate;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getJoinedDate() { return joinedDate; }
    public void setJoinedDate(String joinedDate) { this.joinedDate = joinedDate; }
}
