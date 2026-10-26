package com.fitsync.dto.plan;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class MembershipPlanDto {
    private String id;
    private String name;
    private BigDecimal price;
    private int durationMonths;
    private List<String> features = new ArrayList<>();
    private boolean popular;
    private String description;
    private long activeMembersCount;

    public MembershipPlanDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public int getDurationMonths() { return durationMonths; }
    public void setDurationMonths(int durationMonths) { this.durationMonths = durationMonths; }

    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }

    public boolean isPopular() { return popular; }
    public void setPopular(boolean popular) { this.popular = popular; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public long getActiveMembersCount() { return activeMembersCount; }
    public void setActiveMembersCount(long activeMembersCount) { this.activeMembersCount = activeMembersCount; }
}
